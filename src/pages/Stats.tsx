import Icon from "@/components/ui/icon";

const weekData = [
  { day: "Пн", ban: 4, kick: 8, del: 12, dov: 2 },
  { day: "Вт", ban: 2, kick: 5, del: 9, dov: 1 },
  { day: "Ср", ban: 7, kick: 11, del: 15, dov: 3 },
  { day: "Чт", ban: 3, kick: 6, del: 8, dov: 4 },
  { day: "Пт", ban: 9, kick: 14, del: 20, dov: 2 },
  { day: "Сб", ban: 5, kick: 9, del: 11, dov: 1 },
  { day: "Вс", ban: 6, kick: 12, del: 17, dov: 5 },
];

const topMods = [
  { name: "Алекс", actions: 234, bans: 48, kicks: 89, icon: "Crown", color: "text-yellow-400" },
  { name: "Марина", actions: 178, bans: 22, kicks: 67, icon: "Shield", color: "text-blue-400" },
  { name: "Даша", actions: 92, bans: 8, kicks: 34, icon: "Shield", color: "text-blue-400" },
  { name: "Рома", actions: 67, bans: 5, kicks: 28, icon: "ShieldHalf", color: "text-purple-400" },
  { name: "Катя", actions: 45, bans: 3, kicks: 19, icon: "ShieldHalf", color: "text-purple-400" },
];

const commandStats = [
  { cmd: "/кик", count: 134, pct: 38, color: "bg-orange-400" },
  { cmd: "/удалить", count: 98, pct: 28, color: "bg-yellow-400" },
  { cmd: "/бан", count: 48, pct: 14, color: "bg-red-400" },
  { cmd: "/жалоба", count: 45, pct: 13, color: "bg-blue-400" },
  { cmd: "/дов", count: 22, pct: 7, color: "bg-green-400" },
];

const maxVal = Math.max(...weekData.map((d) => d.ban + d.kick + d.del + d.dov));

export default function Stats() {
  return (
    <div className="p-6 space-y-5 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Статистика</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Аналитика использования бота</p>
        </div>
        <div className="flex gap-2">
          {["7 дней", "30 дней", "Всё время"].map((p, i) => (
            <button
              key={p}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                i === 0
                  ? "bg-primary/20 border-primary/40 text-primary"
                  : "bg-secondary border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Всего действий", value: "347", sub: "за 7 дней", icon: "Activity", color: "text-primary" },
          { label: "Банов выдано", value: "36", sub: "+12 к прошлой нед.", icon: "Ban", color: "text-red-400" },
          { label: "Удалено сообщений", value: "92", sub: "за 7 дней", icon: "Trash2", color: "text-yellow-400" },
          { label: "Среднее в день", value: "49.6", sub: "действий/день", icon: "TrendingUp", color: "text-green-400" },
        ].map((s, i) => (
          <div key={i} className="stat-card animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <Icon name={s.icon} size={16} className={s.color} />
            </div>
            <p className="text-2xl font-semibold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-foreground">Активность за неделю</h2>
            <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" />Бан</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />Кик</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />Удалить</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 inline-block" />Дов</span>
            </div>
          </div>
          <div className="flex items-end gap-2 h-36">
            {weekData.map((d, i) => {
              const total = d.ban + d.kick + d.del + d.dov;
              const pct = (total / maxVal) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                  <div
                    className="w-full flex flex-col justify-end rounded-t-md overflow-hidden transition-all duration-300 cursor-pointer"
                    style={{ height: `${pct}%` }}
                    title={`${d.day}: ${total} действий`}
                  >
                    <div className="bg-green-400/70" style={{ height: `${(d.dov / total) * 100}%` }} />
                    <div className="bg-yellow-400/70" style={{ height: `${(d.del / total) * 100}%` }} />
                    <div className="bg-orange-400/70" style={{ height: `${(d.kick / total) * 100}%` }} />
                    <div className="bg-red-400/70" style={{ height: `${(d.ban / total) * 100}%` }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono-vk">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Command breakdown */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Топ команд</h2>
          <div className="space-y-3">
            {commandStats.map((c, i) => (
              <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono-vk text-foreground">{c.cmd}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">{c.count}</span>
                    <span className="text-[10px] text-muted-foreground/60">{c.pct}%</span>
                  </div>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full ${c.color} rounded-full transition-all duration-700`}
                    style={{ width: `${c.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top moderators */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">Топ модераторов</h2>
        <div className="space-y-1">
          {topMods.map((mod, i) => (
            <div key={i} className="flex items-center gap-4 py-2.5 px-3 rounded-lg hover:bg-secondary/40 transition-colors">
              <span className="text-lg font-semibold text-muted-foreground/40 w-6 font-mono-vk">{i + 1}</span>
              <div className={`p-1.5 rounded-lg bg-secondary`}>
                <Icon name={mod.icon} size={14} className={mod.color} />
              </div>
              <span className="text-sm font-medium text-foreground flex-1">{mod.name}</span>
              <div className="flex items-center gap-6 text-xs text-muted-foreground">
                <span><span className="text-red-400 font-mono-vk">{mod.bans}</span> банов</span>
                <span><span className="text-orange-400 font-mono-vk">{mod.kicks}</span> киков</span>
                <span className="font-mono-vk text-foreground">{mod.actions} всего</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
