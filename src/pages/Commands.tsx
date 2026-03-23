import Icon from "@/components/ui/icon";
import { useState } from "react";

const commands = [
  {
    cmd: "/кик",
    alias: "/kick",
    desc: "Исключить пользователя из беседы",
    icon: "UserX",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/20",
    usage: "/кик @пользователь [причина]",
    perms: ["Модератор", "Администратор"],
    enabled: true,
    cooldown: "5с",
  },
  {
    cmd: "/бан",
    alias: "/ban",
    desc: "Заблокировать пользователя и занести в чёрный список",
    icon: "Ban",
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/20",
    usage: "/бан @пользователь [причина]",
    perms: ["Администратор"],
    enabled: true,
    cooldown: "10с",
  },
  {
    cmd: "/удалить",
    alias: "/del",
    desc: "Удалить сообщение пользователя из беседы",
    icon: "Trash2",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20",
    usage: "/удалить [кол-во]",
    perms: ["Модератор", "Администратор"],
    enabled: true,
    cooldown: "2с",
  },
  {
    cmd: "/дов",
    alias: "/trust",
    desc: "Выдать пользователю доверенный статус",
    icon: "UserCheck",
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/20",
    usage: "/дов @пользователь",
    perms: ["Администратор"],
    enabled: true,
    cooldown: "30с",
  },
  {
    cmd: "/жалоба",
    alias: "/report",
    desc: "Отправить жалобу на пользователя администрации",
    icon: "Flag",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
    usage: "/жалоба @пользователь причина",
    perms: ["Все участники"],
    enabled: true,
    cooldown: "60с",
  },
];

export default function Commands() {
  const [selected, setSelected] = useState<number | null>(0);
  const [search, setSearch] = useState("");

  const filtered = commands.filter(
    (c) =>
      c.cmd.includes(search.toLowerCase()) ||
      c.alias.includes(search.toLowerCase()) ||
      c.desc.toLowerCase().includes(search.toLowerCase())
  );

  const cmd = selected !== null ? filtered[selected] : null;

  return (
    <div className="p-6 space-y-5 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Команды</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Настройка и управление командами бота</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Command list */}
        <div className="lg:col-span-2 space-y-2">
          <div className="relative">
            <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск команды..."
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          {filtered.map((c, i) => (
            <div
              key={i}
              onClick={() => setSelected(i)}
              className={`rounded-xl border p-4 cursor-pointer transition-all duration-200 ${
                selected === i
                  ? `${c.bg} ${c.border} border`
                  : "bg-card border-border hover:border-border/80"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${c.bg} border ${c.border}`}>
                  <Icon name={c.icon} size={15} className={c.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-mono-vk font-semibold ${c.color}`}>{c.cmd}</span>
                    <span className="text-[10px] text-muted-foreground font-mono-vk">{c.alias}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{c.desc}</p>
                </div>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${c.enabled ? "bg-green-400" : "bg-muted-foreground/30"}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Command detail */}
        <div className="lg:col-span-3">
          {cmd ? (
            <div className="rounded-xl border border-border bg-card p-6 space-y-5 animate-fade-in">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${cmd.bg} border ${cmd.border}`}>
                    <Icon name={cmd.icon} size={22} className={cmd.color} />
                  </div>
                  <div>
                    <h2 className={`text-xl font-mono-vk font-semibold ${cmd.color}`}>{cmd.cmd}</h2>
                    <p className="text-sm text-muted-foreground">{cmd.desc}</p>
                  </div>
                </div>
                <button className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  cmd.enabled
                    ? "bg-green-400/10 border-green-400/20 text-green-400"
                    : "bg-secondary border-border text-muted-foreground"
                }`}>
                  {cmd.enabled ? "Включена" : "Выключена"}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">Использование</p>
                  <div className="bg-secondary rounded-lg px-4 py-3 font-mono-vk text-sm text-foreground border border-border">
                    {cmd.usage}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">Кулдаун</p>
                    <div className="flex items-center gap-2 bg-secondary rounded-lg px-4 py-3 border border-border">
                      <Icon name="Timer" size={14} className="text-muted-foreground" />
                      <span className="text-sm font-mono-vk text-foreground">{cmd.cooldown}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">Псевдоним</p>
                    <div className="flex items-center gap-2 bg-secondary rounded-lg px-4 py-3 border border-border">
                      <Icon name="Hash" size={14} className="text-muted-foreground" />
                      <span className="text-sm font-mono-vk text-foreground">{cmd.alias}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">Доступно ролям</p>
                  <div className="flex flex-wrap gap-2">
                    {cmd.perms.map((p, i) => (
                      <span key={i} className="role-badge bg-primary/10 border-primary/20 text-primary">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                  <Icon name="Save" size={14} />
                  Сохранить изменения
                </button>
                <button className="px-4 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
                  <Icon name="RotateCcw" size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card p-12 flex flex-col items-center justify-center text-center">
              <Icon name="Terminal" size={32} className="text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">Выбери команду для настройки</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
