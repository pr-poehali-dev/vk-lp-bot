import Icon from "@/components/ui/icon";
import { useState } from "react";

const sections = [
  {
    id: "start",
    title: "Быстрый старт",
    icon: "Rocket",
    color: "text-blue-400",
    items: [
      {
        q: "Как подключить бота к беседе ВК?",
        a: "Добавь бота в беседу ВКонтакте как администратора. Затем в разделе «Дашборд» нажми «Подключено/Не подключено» и введи токен сообщества. Бот начнёт получать сообщения автоматически.",
      },
      {
        q: "Как получить токен сообщества?",
        a: "Перейди в настройки сообщества ВКонтакте → Работа с API → Создать ключ доступа. Выбери нужные права (управление сообществом, доступ к сообщениям) и скопируй полученный токен.",
      },
      {
        q: "Бот не реагирует на команды — что делать?",
        a: "Убедись что: 1) Бот добавлен в беседу как администратор; 2) Токен введён верно и не просрочен; 3) В настройках команды включена. Проверь статус подключения на дашборде.",
      },
    ],
  },
  {
    id: "commands",
    title: "Команды",
    icon: "Terminal",
    color: "text-green-400",
    items: [
      {
        q: "Как использовать /кик?",
        a: "Напиши в беседе: /кик @пользователь причина — например, /кик @ivan_petrov флуд. Бот исключит пользователя и сохранит запись в логах. Доступно модераторам и выше.",
      },
      {
        q: "В чём разница между /кик и /бан?",
        a: "/кик — временное исключение из беседы, пользователь может быть добавлен снова. /бан — занесение в чёрный список, повторное добавление заблокировано. Бан доступен только администраторам.",
      },
      {
        q: "Как работает /дов?",
        a: "/дов @пользователь — выдаёт статус «Доверенный». Это маркер для команды: участник проверен и ведёт себя корректно. Команда доступна только администраторам.",
      },
      {
        q: "Кто может подавать /жалоба?",
        a: "Команду /жалоба могут использовать все участники беседы. Жалоба уходит администрации и фиксируется в логах. Кулдаун — 60 секунд (чтобы избежать спама жалобами).",
      },
    ],
  },
  {
    id: "roles",
    title: "Роли и права",
    icon: "Shield",
    color: "text-purple-400",
    items: [
      {
        q: "Как добавить нового модератора?",
        a: "Перейди в раздел «Пользователи» → нажми «Добавить пользователя» → введи @ник или ID в ВК → выбери роль. Пользователь сразу получит доступ к командам своей роли.",
      },
      {
        q: "Какие роли есть в системе?",
        a: "Администратор (полный доступ), Модератор (/кик, /удалить, /жалоба), Младший мод (/удалить, /жалоба), Доверенный (/жалоба), Заблокирован (нет доступа к командам).",
      },
    ],
  },
  {
    id: "logs",
    title: "Логи и экспорт",
    icon: "ScrollText",
    color: "text-orange-400",
    items: [
      {
        q: "Как долго хранятся логи?",
        a: "Логи хранятся 30 дней. Для постоянного архива используй экспорт — кнопка в разделе «Логи». Данные выгружаются в CSV формате.",
      },
      {
        q: "Можно ли отфильтровать логи по конкретному модератору?",
        a: "Да. В разделе «Логи» используй поиск — введи имя модератора в строку поиска. Также можно фильтровать по типу команды (бан, кик и т.д.).",
      },
    ],
  },
];

export default function Help() {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("start");

  const section = sections.find((s) => s.id === activeSection)!;

  return (
    <div className="p-6 space-y-5 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Справка</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Документация и часто задаваемые вопросы</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Sidebar nav */}
        <div className="lg:col-span-1 space-y-1.5">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-all ${
                activeSection === s.id
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <Icon name={s.icon} size={14} className={activeSection === s.id ? s.color : ""} />
              {s.title}
            </button>
          ))}

          <div className="mt-4 pt-4 border-t border-border">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2.5">
              <div className="flex items-center gap-2">
                <Icon name="MessageCircle" size={14} className="text-primary" />
                <span className="text-xs font-medium text-foreground">Нужна помощь?</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Напиши нам — поможем разобраться с настройкой бота.
              </p>
              <button className="w-full px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
                Написать в поддержку
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <div className={`p-2 rounded-lg bg-secondary`}>
              <Icon name={section.icon} size={16} className={section.color} />
            </div>
            <h2 className="text-lg font-semibold text-foreground">{section.title}</h2>
          </div>

          {section.items.map((item, i) => {
            const key = `${section.id}-${i}`;
            const isOpen = openItem === key;
            return (
              <div
                key={i}
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                  isOpen ? "border-primary/30 bg-primary/5" : "border-border bg-card hover:border-border/80"
                }`}
              >
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                  onClick={() => setOpenItem(isOpen ? null : key)}
                >
                  <span className="text-sm font-medium text-foreground pr-4">{item.q}</span>
                  <Icon
                    name="ChevronDown"
                    size={16}
                    className={`text-muted-foreground flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 animate-fade-in">
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Command reference */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="BookMarked" size={14} className="text-muted-foreground" />
          Быстрая справка по командам
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { cmd: "/кик", usage: "@user [причина]", perm: "Модератор+", icon: "UserX", color: "text-orange-400" },
            { cmd: "/бан", usage: "@user [причина]", perm: "Администратор", icon: "Ban", color: "text-red-400" },
            { cmd: "/удалить", usage: "[кол-во]", perm: "Модератор+", icon: "Trash2", color: "text-yellow-400" },
            { cmd: "/дов", usage: "@user", perm: "Администратор", icon: "UserCheck", color: "text-green-400" },
            { cmd: "/жалоба", usage: "@user причина", perm: "Все участники", icon: "Flag", color: "text-blue-400" },
          ].map((c, i) => (
            <div key={i} className="bg-secondary rounded-lg p-3 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Icon name={c.icon} size={13} className={c.color} />
                <span className={`text-xs font-mono-vk font-semibold ${c.color}`}>{c.cmd}</span>
              </div>
              <div className="font-mono-vk text-[10px] text-muted-foreground">{c.usage}</div>
              <div className="text-[10px] text-muted-foreground/60 mt-1">{c.perm}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
