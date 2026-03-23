import Icon from "@/components/ui/icon";
import { useState } from "react";

const allLogs = [
  { id: 1, action: "бан", user: "@shadow_lord", userId: "123456", mod: "Алекс", reason: "Спам", time: "14:32", date: "Сегодня", icon: "Ban", color: "text-red-400", bg: "bg-red-400/10" },
  { id: 2, action: "кик", user: "@toxic_user99", userId: "234567", mod: "Марина", reason: "Флуд", time: "14:25", date: "Сегодня", icon: "UserX", color: "text-orange-400", bg: "bg-orange-400/10" },
  { id: 3, action: "удалить", user: "@spammer_bot", userId: "345678", mod: "Алекс", reason: "Реклама", time: "14:17", date: "Сегодня", icon: "Trash2", color: "text-yellow-400", bg: "bg-yellow-400/10" },
  { id: 4, action: "дов", user: "@newuser_2024", userId: "456789", mod: "Даша", reason: "Проверен", time: "13:54", date: "Сегодня", icon: "UserCheck", color: "text-green-400", bg: "bg-green-400/10" },
  { id: 5, action: "жалоба", user: "@abuse123", userId: "567890", mod: "Марина", reason: "Оскорбления", time: "13:41", date: "Сегодня", icon: "Flag", color: "text-blue-400", bg: "bg-blue-400/10" },
  { id: 6, action: "бан", user: "@flood_king", userId: "678901", mod: "Рома", reason: "Систематический флуд", time: "12:20", date: "Сегодня", icon: "Ban", color: "text-red-400", bg: "bg-red-400/10" },
  { id: 7, action: "кик", user: "@newbie_troll", userId: "789012", mod: "Алекс", reason: "Провокации", time: "11:55", date: "Сегодня", icon: "UserX", color: "text-orange-400", bg: "bg-orange-400/10" },
  { id: 8, action: "удалить", user: "@link_poster", userId: "890123", mod: "Катя", reason: "Ссылки", time: "22:10", date: "Вчера", icon: "Trash2", color: "text-yellow-400", bg: "bg-yellow-400/10" },
  { id: 9, action: "дов", user: "@good_user", userId: "901234", mod: "Даша", reason: "Активный участник", time: "21:33", date: "Вчера", icon: "UserCheck", color: "text-green-400", bg: "bg-green-400/10" },
  { id: 10, action: "бан", user: "@hater99", userId: "012345", mod: "Алекс", reason: "Угрозы", time: "19:44", date: "Вчера", icon: "Ban", color: "text-red-400", bg: "bg-red-400/10" },
];

const filters = ["Все", "бан", "кик", "удалить", "дов", "жалоба"];

export default function Logs() {
  const [activeFilter, setActiveFilter] = useState("Все");
  const [search, setSearch] = useState("");

  const filtered = allLogs.filter((l) => {
    const matchFilter = activeFilter === "Все" || l.action === activeFilter;
    const matchSearch =
      !search ||
      l.user.includes(search) ||
      l.mod.toLowerCase().includes(search.toLowerCase()) ||
      l.reason.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="p-6 space-y-5 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Логи модерации</h1>
          <p className="text-sm text-muted-foreground mt-0.5">История всех действий бота</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
          <Icon name="Download" size={13} />
          Экспорт
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по пользователю, модератору, причине..."
            className="w-full pl-9 pr-3 py-2.5 text-sm bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-2 rounded-lg text-xs font-medium font-mono-vk transition-all border ${
                activeFilter === f
                  ? "bg-primary/20 border-primary/40 text-primary"
                  : "bg-secondary border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "Все" ? f : `/${f}`}
            </button>
          ))}
        </div>
      </div>

      {/* Log table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-0 text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-4 py-3 border-b border-border bg-secondary/30">
          <div className="w-24">Действие</div>
          <div className="pl-3">Пользователь</div>
          <div className="w-24 text-center">Модератор</div>
          <div className="w-40 px-3">Причина</div>
          <div className="w-20 text-center">Время</div>
          <div className="w-8" />
        </div>

        <div className="divide-y divide-border/50">
          {filtered.map((log, i) => (
            <div
              key={log.id}
              className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-0 items-center px-4 py-3 hover:bg-secondary/30 transition-colors animate-fade-in"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <div className="w-24">
                <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md ${log.bg}`}>
                  <Icon name={log.icon} size={11} className={log.color} />
                  <span className={`text-[10px] font-mono-vk font-medium ${log.color}`}>/{log.action}</span>
                </div>
              </div>
              <div className="pl-3">
                <span className="text-sm text-foreground">{log.user}</span>
                <span className="text-[10px] text-muted-foreground ml-2 font-mono-vk">#{log.userId}</span>
              </div>
              <div className="w-24 text-center">
                <span className="text-xs text-muted-foreground">{log.mod}</span>
              </div>
              <div className="w-40 px-3">
                <span className="text-xs text-muted-foreground truncate block">{log.reason}</span>
              </div>
              <div className="w-20 text-center">
                <div className="text-[10px] text-muted-foreground font-mono-vk">{log.time}</div>
                <div className="text-[10px] text-muted-foreground/50">{log.date}</div>
              </div>
              <div className="w-8 flex justify-end">
                <button className="p-1 rounded text-muted-foreground/40 hover:text-muted-foreground transition-colors">
                  <Icon name="MoreVertical" size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <Icon name="SearchX" size={28} className="text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Ничего не найдено</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Показано {filtered.length} из {allLogs.length} записей</span>
        <span className="font-mono-vk">Хранятся последние 30 дней</span>
      </div>
    </div>
  );
}
