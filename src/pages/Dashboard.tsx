import Icon from "@/components/ui/icon";
import { useNavigate } from "react-router-dom";

const stats = [
  { label: "Выполнено команд", value: "1 247", delta: "+34 сегодня", icon: "Zap", color: "text-blue-400" },
  { label: "Забанено", value: "48", delta: "+3 сегодня", icon: "Ban", color: "text-red-400" },
  { label: "Кикнуто", value: "134", delta: "+12 сегодня", icon: "UserX", color: "text-orange-400" },
  { label: "Активных модеров", value: "6", delta: "из 8 онлайн", icon: "Shield", color: "text-green-400" },
];

const recentLogs = [
  { action: "бан", user: "@shadow_lord", mod: "Алекс", time: "2 мин назад", color: "text-red-400", icon: "Ban" },
  { action: "кик", user: "@toxic_user99", mod: "Марина", time: "7 мин назад", color: "text-orange-400", icon: "UserX" },
  { action: "удалить", user: "@spammer_bot", mod: "Алекс", time: "15 мин назад", color: "text-yellow-400", icon: "Trash2" },
  { action: "дов", user: "@newuser_2024", mod: "Даша", time: "23 мин назад", color: "text-green-400", icon: "UserCheck" },
  { action: "жалоба", user: "@abuse_report", mod: "Марина", time: "41 мин назад", color: "text-blue-400", icon: "Flag" },
];

const quickCmds = [
  { label: "Кик", icon: "UserX", color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/20 hover:border-orange-400/50" },
  { label: "Бан", icon: "Ban", color: "text-red-400", bg: "bg-red-400/10 border-red-400/20 hover:border-red-400/50" },
  { label: "Удалить", icon: "Trash2", color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20 hover:border-yellow-400/50" },
  { label: "Дов", icon: "UserCheck", color: "text-green-400", bg: "bg-green-400/10 border-green-400/20 hover:border-green-400/50" },
  { label: "Жалоба", icon: "Flag", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20 hover:border-blue-400/50" },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Дашборд</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Обзор активности бота</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 pulse-dot" />
          <span className="text-xs text-muted-foreground font-mono-vk">Бот активен</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="stat-card animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                <p className="text-2xl font-semibold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.delta}</p>
              </div>
              <div className={`p-2 rounded-lg bg-secondary`}>
                <Icon name={s.icon} size={18} className={s.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent logs */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Последние действия</h2>
            <button
              onClick={() => navigate("/logs")}
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              Все логи →
            </button>
          </div>
          <div className="space-y-1">
            {recentLogs.map((log, i) => (
              <div key={i} className="log-row animate-fade-in" style={{ animationDelay: `${i * 50 + 200}ms` }}>
                <div className={`p-1.5 rounded-md bg-secondary`}>
                  <Icon name={log.icon} size={13} className={log.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`text-xs font-mono-vk font-medium ${log.color}`}>/{log.action}</span>
                  <span className="text-xs text-foreground ml-2">{log.user}</span>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-muted-foreground">{log.mod}</div>
                  <div className="text-[10px] text-muted-foreground/60">{log.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick commands */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Быстрые команды</h2>
          <div className="space-y-2">
            {quickCmds.map((cmd, i) => (
              <button
                key={i}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200 ${cmd.bg}`}
                onClick={() => navigate("/commands")}
              >
                <Icon name={cmd.icon} size={15} className={cmd.color} />
                <span className={`${cmd.color}`}>/{cmd.label.toLowerCase()}</span>
                <Icon name="ArrowRight" size={12} className="ml-auto text-muted-foreground/50" />
              </button>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground mt-3 text-center">
            Настройка команд в разделе «Команды»
          </p>
        </div>
      </div>

      {/* Moderators online */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">Модераторы онлайн</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { name: "Алекс", role: "Администратор", online: true },
            { name: "Марина", role: "Модератор", online: true },
            { name: "Даша", role: "Модератор", online: true },
            { name: "Коля", role: "Модератор", online: false },
            { name: "Рома", role: "Младший мод", online: true },
            { name: "Катя", role: "Младший мод", online: false },
          ].map((mod, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary border border-border">
              <div className={`w-1.5 h-1.5 rounded-full ${mod.online ? "bg-green-400" : "bg-muted-foreground/30"}`} />
              <span className="text-xs font-medium text-foreground">{mod.name}</span>
              <span className="text-[10px] text-muted-foreground">{mod.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
