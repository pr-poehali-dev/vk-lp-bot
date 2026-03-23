import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { useState, useEffect } from "react";

const BOT_CONFIG_URL = "https://functions.poehali.dev/ab2de6d7-d1de-4b37-9771-1d898b7212ea";
export const WEBHOOK_URL = "https://functions.poehali.dev/8f10f7d8-643e-4eb2-a09f-3075de9850f3";

const navItems = [
  { path: "/", label: "Дашборд", icon: "LayoutDashboard" },
  { path: "/commands", label: "Команды", icon: "Terminal" },
  { path: "/logs", label: "Логи", icon: "ScrollText" },
  { path: "/users", label: "Пользователи", icon: "Users" },
  { path: "/stats", label: "Статистика", icon: "BarChart3" },
  { path: "/help", label: "Справка", icon: "BookOpen" },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showConnect, setShowConnect] = useState(false);
  const [groupId, setGroupId] = useState("");
  const [groupName, setGroupName] = useState("");
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<{ group_id: number | null; token_set: boolean; is_active: boolean; group_name?: string } | null>(null);

  useEffect(() => {
    fetch(`${BOT_CONFIG_URL}/`)
      .then((r) => r.json())
      .then(setConfig)
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    if (!groupId) return;
    setSaving(true);
    try {
      const res = await fetch(`${BOT_CONFIG_URL}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save", group_id: parseInt(groupId), group_name: groupName }),
      });
      const data = await res.json();
      if (data.ok) {
        setConfig({ group_id: parseInt(groupId), group_name: groupName, token_set: data.token_set, is_active: true });
        setShowConnect(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const isConnected = !!(config?.is_active && config?.token_set);

  return (
    <div className="flex h-screen overflow-hidden bg-background grid-bg">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 flex flex-col border-r border-border bg-card/60 backdrop-blur-sm">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Icon name="Bot" size={16} className="text-primary" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground leading-none">LP Bot</div>
              <div className="text-[10px] text-muted-foreground mt-0.5 font-mono-vk">v1.0 · ВКонтакте</div>
            </div>
          </div>
        </div>

        {/* Connection status */}
        <div className="px-4 py-3 border-b border-border">
          <div
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-secondary/60 cursor-pointer hover:bg-secondary transition-colors"
            onClick={() => setShowConnect(true)}
          >
            <div className={`w-2 h-2 rounded-full pulse-dot ${isConnected ? "bg-green-400" : "bg-red-400"}`} />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-foreground truncate">
                {isConnected ? (config?.group_name || `Группа #${config?.group_id}`) : "Не подключено"}
              </div>
              <div className="text-[10px] text-muted-foreground">
                {isConnected ? "Бот активен" : "Нажми для настройки"}
              </div>
            </div>
            <Icon name="Settings" size={12} className="text-muted-foreground flex-shrink-0" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <div
                key={item.path}
                className={`nav-item ${isActive ? "active" : ""}`}
                onClick={() => navigate(item.path)}
              >
                <Icon name={item.icon} size={16} className={isActive ? "text-primary" : ""} />
                <span>{item.label}</span>
              </div>
            );
          })}
        </nav>

        {/* Bottom user info */}
        <div className="px-4 py-4 border-t border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
              <Icon name="Crown" size={12} className="text-primary" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-foreground truncate">Администратор</div>
              <div className="text-[10px] text-muted-foreground">Полный доступ</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </main>

      {/* Connect modal */}
      {showConnect && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowConnect(false)}>
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-foreground">Подключение к ВКонтакте</h2>
              <button onClick={() => setShowConnect(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <Icon name="X" size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">ID сообщества ВК</label>
                <input
                  value={groupId}
                  onChange={(e) => setGroupId(e.target.value)}
                  placeholder="Например: 123456789"
                  className="w-full px-3 py-2.5 text-sm bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors font-mono-vk"
                />
                <p className="text-[10px] text-muted-foreground mt-1">Настройки сообщества → Информация → ID</p>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Название сообщества</label>
                <input
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Моё сообщество"
                  className="w-full px-3 py-2.5 text-sm bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              <div className="bg-secondary/60 rounded-xl p-4 border border-border space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                  <Icon name="Link" size={13} className="text-primary" />
                  URL для Callback API ВКонтакте
                </div>
                <div className="font-mono-vk text-[10px] text-muted-foreground bg-background/60 rounded-lg px-3 py-2 border border-border break-all select-all">
                  {WEBHOOK_URL}
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Вставь этот URL в настройках сообщества → Работа с API → Callback API
                </p>
              </div>

              {config && !config.token_set && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-orange-400/10 border border-orange-400/20">
                  <Icon name="AlertTriangle" size={14} className="text-orange-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-orange-400">
                    VK_TOKEN не добавлен. Добавь токен сообщества в секреты проекта — бот не будет работать без него.
                  </p>
                </div>
              )}

              <button
                onClick={handleSave}
                disabled={!groupId || saving}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? <Icon name="Loader" size={14} className="animate-spin" /> : <Icon name="Save" size={14} />}
                {saving ? "Сохраняем..." : "Сохранить настройки"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
