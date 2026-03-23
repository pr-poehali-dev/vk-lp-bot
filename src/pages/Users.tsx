import Icon from "@/components/ui/icon";
import { useState } from "react";

const roles = [
  { id: "admin", label: "Администратор", color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20", icon: "Crown", level: 3 },
  { id: "moder", label: "Модератор", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", icon: "Shield", level: 2 },
  { id: "junior", label: "Младший мод", color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20", icon: "ShieldHalf", level: 1 },
  { id: "trusted", label: "Доверенный", color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20", icon: "UserCheck", level: 0 },
  { id: "banned", label: "Заблокирован", color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20", icon: "Ban", level: -1 },
];

const users = [
  { id: "111", name: "Алексей К.", vkId: "@alex_k", role: "admin", actions: 234, joined: "01.12.2023", online: true },
  { id: "222", name: "Марина В.", vkId: "@marina_v", role: "moder", actions: 178, joined: "15.01.2024", online: true },
  { id: "333", name: "Дарья С.", vkId: "@dasha_s", role: "moder", actions: 92, joined: "20.02.2024", online: true },
  { id: "444", name: "Николай П.", vkId: "@kolya_p", role: "junior", actions: 45, joined: "10.03.2024", online: false },
  { id: "555", name: "Роман Д.", vkId: "@roma_d", role: "junior", actions: 67, joined: "05.03.2024", online: true },
  { id: "666", name: "Екатерина М.", vkId: "@katya_m", role: "trusted", actions: 0, joined: "22.03.2024", online: false },
  { id: "777", name: "shadow_lord", vkId: "@shadow_lord", role: "banned", actions: 0, joined: "10.01.2024", online: false },
];

const rolePerms: Record<string, string[]> = {
  admin: ["/кик", "/бан", "/удалить", "/дов", "/жалоба", "Настройки бота", "Управление ролями"],
  moder: ["/кик", "/удалить", "/жалоба"],
  junior: ["/удалить", "/жалоба"],
  trusted: ["/жалоба"],
  banned: [],
};

export default function Users() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const getRoleInfo = (roleId: string) => roles.find((r) => r.id === roleId)!;

  const filtered = users.filter((u) => {
    const matchRole = !selectedRole || u.role === selectedRole;
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.vkId.includes(search);
    return matchRole && matchSearch;
  });

  return (
    <div className="p-6 space-y-5 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Пользователи</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Управление ролями и правами доступа</p>
      </div>

      {/* Role cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {roles.map((role) => {
          const count = users.filter((u) => u.role === role.id).length;
          const isActive = selectedRole === role.id;
          return (
            <div
              key={role.id}
              onClick={() => setSelectedRole(isActive ? null : role.id)}
              className={`rounded-xl border p-4 cursor-pointer transition-all duration-200 ${
                isActive ? `${role.bg} ${role.border}` : "bg-card border-border hover:border-border/60"
              }`}
            >
              <div className={`p-2 rounded-lg ${role.bg} border ${role.border} w-fit mb-3`}>
                <Icon name={role.icon} size={14} className={role.color} />
              </div>
              <div className="text-lg font-semibold text-foreground">{count}</div>
              <div className={`text-xs font-medium ${role.color} mt-0.5`}>{role.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Users list */}
        <div className="lg:col-span-2 space-y-3">
          <div className="relative">
            <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по имени или @нику..."
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {filtered.map((user, i) => {
              const role = getRoleInfo(user.role);
              return (
                <div
                  key={user.id}
                  className="flex items-center gap-3 px-4 py-3.5 hover:bg-secondary/40 transition-colors border-b border-border/50 last:border-0 animate-fade-in"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className={`relative w-9 h-9 rounded-full ${role.bg} border ${role.border} flex items-center justify-center flex-shrink-0`}>
                    <Icon name={role.icon} size={14} className={role.color} />
                    <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background ${user.online ? "bg-green-400" : "bg-muted-foreground/30"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{user.name}</span>
                      <span className="text-[10px] text-muted-foreground font-mono-vk">{user.vkId}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className={`role-badge ${role.bg} ${role.border} ${role.color}`}>{role.label}</span>
                      <span className="text-[10px] text-muted-foreground">{user.actions} действий</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
                      <Icon name="Edit2" size={13} />
                    </button>
                    {user.role !== "banned" && (
                      <button className="p-1.5 rounded-md text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-all">
                        <Icon name="Ban" size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="py-10 text-center">
                <p className="text-sm text-muted-foreground">Пользователи не найдены</p>
              </div>
            )}
          </div>
        </div>

        {/* Role permissions */}
        <div className="space-y-3">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Icon name="Lock" size={14} className="text-muted-foreground" />
              Права по ролям
            </h2>
            <div className="space-y-3">
              {roles.map((role) => (
                <div key={role.id} className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Icon name={role.icon} size={12} className={role.color} />
                    <span className={`text-xs font-medium ${role.color}`}>{role.label}</span>
                  </div>
                  <div className="pl-5 flex flex-wrap gap-1">
                    {rolePerms[role.id].length > 0 ? (
                      rolePerms[role.id].map((p, i) => (
                        <span key={i} className="text-[10px] font-mono-vk px-1.5 py-0.5 rounded bg-secondary border border-border text-muted-foreground">
                          {p}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-muted-foreground/50 italic">Нет прав</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            <Icon name="UserPlus" size={14} />
            Добавить пользователя
          </button>
        </div>
      </div>
    </div>
  );
}
