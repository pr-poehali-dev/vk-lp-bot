"""
VK LP Bot — API для управления конфигурацией бота и модераторами.
Маршрутизация через ?action=...
GET /?action=config — получить конфиг бота
POST / (body action=save) — сохранить group_id
GET /?action=moderators — список модераторов
POST / (body action=add_mod) — добавить модератора
POST / (body action=update_mod) — изменить роль
POST / (body action=remove_mod) — удалить модератора
GET /?action=logs — получить логи
"""
import json
import os
import psycopg2

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "t_p93119858_vk_lp_bot")

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def resp(data, status=200):
    return {
        "statusCode": status,
        "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
        "body": json.dumps(data, default=str, ensure_ascii=False)
    }


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}
    action = params.get("action", "config")

    body = {}
    if event.get("body"):
        body = json.loads(event["body"])
        if not action or action == "config":
            action = body.get("action", "config")

    conn = get_db()

    # GET логи
    if action == "logs" and method == "GET":
        filter_action = params.get("filter")
        limit = int(params.get("limit", 50))
        sql = f"""SELECT id, action, target_name, target_vk_id, moderator_name,
                         reason, chat_id, created_at
                  FROM {SCHEMA}.mod_logs"""
        vals = []
        if filter_action:
            sql += " WHERE action = %s"
            vals.append(filter_action)
        sql += f" ORDER BY created_at DESC LIMIT {limit}"
        with conn.cursor() as cur:
            cur.execute(sql, vals)
            cols = [d[0] for d in cur.description]
            rows = [dict(zip(cols, r)) for r in cur.fetchall()]
        conn.close()
        return resp({"logs": rows})

    # GET модераторы
    if action == "moderators" and method == "GET":
        with conn.cursor() as cur:
            cur.execute(f"""SELECT vk_id, name, role, is_active, actions_count, created_at
                           FROM {SCHEMA}.moderators WHERE is_active = TRUE ORDER BY
                           CASE role WHEN 'admin' THEN 1 WHEN 'moder' THEN 2
                                     WHEN 'junior' THEN 3 WHEN 'trusted' THEN 4
                                     ELSE 5 END, actions_count DESC""")
            cols = [d[0] for d in cur.description]
            rows = [dict(zip(cols, r)) for r in cur.fetchall()]
        conn.close()
        return resp({"moderators": rows})

    # POST добавить модератора
    if action == "add_mod":
        vk_id = int(body.get("vk_id", 0))
        name = body.get("name", "")
        role = body.get("role", "trusted")
        if not vk_id or not name:
            conn.close()
            return resp({"error": "vk_id и name обязательны"}, 400)
        with conn.cursor() as cur:
            cur.execute(
                f"""INSERT INTO {SCHEMA}.moderators (vk_id, name, role)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (vk_id) DO UPDATE SET name=%s, role=%s, is_active=TRUE""",
                (vk_id, name, role, name, role)
            )
        conn.commit()
        conn.close()
        return resp({"ok": True})

    # POST обновить роль
    if action == "update_mod":
        vk_id = int(body.get("vk_id", 0))
        role = body.get("role", "trusted")
        with conn.cursor() as cur:
            cur.execute(
                f"UPDATE {SCHEMA}.moderators SET role=%s WHERE vk_id=%s",
                (role, vk_id)
            )
        conn.commit()
        conn.close()
        return resp({"ok": True})

    # POST удалить модератора
    if action == "remove_mod":
        vk_id = int(body.get("vk_id", 0))
        with conn.cursor() as cur:
            cur.execute(
                f"UPDATE {SCHEMA}.moderators SET is_active=FALSE WHERE vk_id=%s",
                (vk_id,)
            )
        conn.commit()
        conn.close()
        return resp({"ok": True})

    # POST сохранить конфиг
    if action == "save":
        group_id = int(body.get("group_id", 0))
        group_name = body.get("group_name", "")
        if not group_id:
            conn.close()
            return resp({"error": "group_id обязателен"}, 400)
        token = os.environ.get("VK_TOKEN", "")
        with conn.cursor() as cur:
            cur.execute(f"DELETE FROM {SCHEMA}.bot_config")
            cur.execute(
                f"""INSERT INTO {SCHEMA}.bot_config (group_id, group_name, token_set, is_active)
                    VALUES (%s, %s, %s, TRUE)""",
                (group_id, group_name, bool(token))
            )
        conn.commit()
        conn.close()
        return resp({"ok": True, "token_set": bool(token)})

    # GET конфиг (по умолчанию)
    with conn.cursor() as cur:
        cur.execute(f"SELECT group_id, group_name, token_set, is_active FROM {SCHEMA}.bot_config LIMIT 1")
        row = cur.fetchone()
    conn.close()
    if row:
        return resp({"group_id": row[0], "group_name": row[1], "token_set": row[2], "is_active": row[3]})
    return resp({"group_id": None, "token_set": False, "is_active": False})
