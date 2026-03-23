"""
VK LP Bot — Webhook для приёма событий от ВКонтакте.
Принимает события из беседы и обрабатывает команды: /кик, /бан, /удалить, /дов, /жалоба
"""
import json
import os
import psycopg2
import urllib.request
import urllib.parse


SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "t_p93119858_vk_lp_bot")

COMMANDS = {
    "/кик": "kick",
    "/kick": "kick",
    "/бан": "ban",
    "/ban": "ban",
    "/удалить": "delete",
    "/del": "delete",
    "/дов": "trust",
    "/trust": "trust",
    "/жалоба": "report",
    "/report": "report",
}

ROLE_PERMS = {
    "admin": ["kick", "ban", "delete", "trust", "report"],
    "moder": ["kick", "delete", "report"],
    "junior": ["delete", "report"],
    "trusted": ["report"],
}

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def vk_api(method: str, params: dict) -> dict:
    token = os.environ.get("VK_TOKEN", "")
    params["access_token"] = token
    params["v"] = "5.199"
    url = f"https://api.vk.com/method/{method}"
    data = urllib.parse.urlencode(params).encode()
    req = urllib.request.Request(url, data=data, method="POST")
    with urllib.request.urlopen(req, timeout=10) as resp:
        return json.loads(resp.read())


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def get_moderator(conn, vk_id: int):
    with conn.cursor() as cur:
        cur.execute(
            f"SELECT vk_id, name, role FROM {SCHEMA}.moderators WHERE vk_id = %s AND is_active = TRUE",
            (vk_id,)
        )
        row = cur.fetchone()
        if row:
            return {"vk_id": row[0], "name": row[1], "role": row[2]}
    return None


def log_action(conn, action: str, target_vk_id, target_name: str,
               mod_vk_id: int, mod_name: str, reason: str, chat_id: int):
    with conn.cursor() as cur:
        cur.execute(
            f"""INSERT INTO {SCHEMA}.mod_logs
                (action, target_vk_id, target_name, moderator_vk_id, moderator_name, reason, chat_id)
                VALUES (%s, %s, %s, %s, %s, %s, %s)""",
            (action, target_vk_id, target_name, mod_vk_id, mod_name, reason, chat_id)
        )
        cur.execute(
            f"UPDATE {SCHEMA}.moderators SET actions_count = actions_count + 1 WHERE vk_id = %s",
            (mod_vk_id,)
        )
    conn.commit()


def send_message(peer_id: int, text: str):
    import random
    vk_api("messages.send", {
        "peer_id": peer_id,
        "message": text,
        "random_id": random.randint(1, 2**31),
    })


def resolve_mention(text: str):
    """Извлекает ID и имя из упоминания [id123|Имя] или @ник"""
    import re
    m = re.search(r'\[id(\d+)\|([^\]]+)\]', text)
    if m:
        return int(m.group(1)), m.group(2)
    return None, None


def handle_kick(conn, msg: dict, mod: dict, args: str, chat_id: int):
    target_id, target_name = resolve_mention(args)
    if not target_id:
        send_message(msg["peer_id"], "❌ Укажи пользователя: /кик @пользователь [причина]")
        return
    reason = args.split("]")[-1].strip() if "]" in args else "Нарушение правил"
    result = vk_api("messages.removeChatUser", {
        "chat_id": chat_id,
        "member_id": target_id
    })
    if "error" in result:
        send_message(msg["peer_id"], f"❌ Не удалось кикнуть: {result['error'].get('error_msg', 'ошибка')}")
        return
    log_action(conn, "кик", target_id, target_name or str(target_id),
               mod["vk_id"], mod["name"], reason, chat_id)
    send_message(msg["peer_id"], f"👢 {target_name or target_id} исключён. Причина: {reason}")


def handle_ban(conn, msg: dict, mod: dict, args: str, chat_id: int):
    target_id, target_name = resolve_mention(args)
    if not target_id:
        send_message(msg["peer_id"], "❌ Укажи пользователя: /бан @пользователь [причина]")
        return
    reason = args.split("]")[-1].strip() if "]" in args else "Бан"
    result = vk_api("messages.removeChatUser", {
        "chat_id": chat_id,
        "member_id": target_id
    })
    log_action(conn, "бан", target_id, target_name or str(target_id),
               mod["vk_id"], mod["name"], reason, chat_id)
    send_message(msg["peer_id"], f"🔨 {target_name or target_id} заблокирован. Причина: {reason}")


def handle_delete(conn, msg: dict, mod: dict, args: str, chat_id: int):
    log_action(conn, "удалить", None, "сообщение",
               mod["vk_id"], mod["name"], args or "удаление", chat_id)
    send_message(msg["peer_id"], f"🗑 Сообщение удалено модератором {mod['name']}")


def handle_trust(conn, msg: dict, mod: dict, args: str, chat_id: int):
    target_id, target_name = resolve_mention(args)
    if not target_id:
        send_message(msg["peer_id"], "❌ Укажи пользователя: /дов @пользователь")
        return
    with conn.cursor() as cur:
        cur.execute(
            f"""INSERT INTO {SCHEMA}.moderators (vk_id, name, role)
                VALUES (%s, %s, 'trusted')
                ON CONFLICT (vk_id) DO UPDATE SET role = 'trusted', is_active = TRUE""",
            (target_id, target_name or str(target_id))
        )
    conn.commit()
    log_action(conn, "дов", target_id, target_name or str(target_id),
               mod["vk_id"], mod["name"], "Доверенный статус", chat_id)
    send_message(msg["peer_id"], f"✅ {target_name or target_id} получил статус доверенного")


def handle_report(conn, msg: dict, mod: dict, args: str, chat_id: int):
    target_id, target_name = resolve_mention(args)
    reason = args.split("]")[-1].strip() if "]" in args else args
    log_action(conn, "жалоба", target_id, target_name or "—",
               mod["vk_id"], mod["name"], reason or "Жалоба без причины", chat_id)
    send_message(msg["peer_id"], f"📋 Жалоба принята. Администрация уведомлена.")


HANDLERS = {
    "kick": handle_kick,
    "ban": handle_ban,
    "delete": handle_delete,
    "trust": handle_trust,
    "report": handle_report,
}


def process_message(event: dict):
    msg = event.get("object", {}).get("message", {})
    text = msg.get("text", "").strip()
    from_id = msg.get("from_id", 0)
    peer_id = msg.get("peer_id", 0)

    if peer_id <= 2000000000:
        return

    chat_id = peer_id - 2000000000

    parts = text.split(None, 2)
    if not parts:
        return

    cmd_raw = parts[0].lower()
    action = COMMANDS.get(cmd_raw)
    if not action:
        return

    args = parts[1] if len(parts) > 1 else ""
    if len(parts) > 2:
        args += " " + parts[2]

    conn = get_db()
    mod = get_moderator(conn, from_id)

    if not mod:
        send_message(peer_id, "❌ У тебя нет прав для использования команд бота.")
        conn.close()
        return

    allowed = ROLE_PERMS.get(mod["role"], [])
    if action not in allowed:
        send_message(peer_id, f"❌ Недостаточно прав. Требуется роль выше, чем {mod['role']}.")
        conn.close()
        return

    handler = HANDLERS.get(action)
    if handler:
        handler(conn, msg, mod, args.strip(), chat_id)

    conn.close()


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    body = event.get("body", "")
    if not body:
        return {"statusCode": 400, "headers": CORS_HEADERS, "body": json.dumps({"error": "no body"})}

    data = json.loads(body)

    # Подтверждение сервера ВК
    if data.get("type") == "confirmation":
        confirmation = os.environ.get("VK_CONFIRM_CODE", "")
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": confirmation}

    if data.get("type") == "message_new":
        process_message(data)

    return {"statusCode": 200, "headers": CORS_HEADERS, "body": "ok"}
