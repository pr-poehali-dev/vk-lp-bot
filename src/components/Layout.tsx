import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { useState } from "react";

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
  const [connected, setConnected] = useState(false);

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
            onClick={() => setConnected(!connected)}
          >
            <div className={`w-2 h-2 rounded-full pulse-dot ${connected ? "bg-green-400" : "bg-red-400"}`} />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-foreground truncate">
                {connected ? "Подключено" : "Не подключено"}
              </div>
              <div className="text-[10px] text-muted-foreground">Нажми для настройки</div>
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
                {item.path === "/logs" && (
                  <span className="ml-auto text-[10px] font-mono-vk bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                    12
                  </span>
                )}
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
    </div>
  );
}
