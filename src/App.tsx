import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";

type IconName =
  | "archive"
  | "arrow"
  | "attachment"
  | "book"
  | "check"
  | "chevron"
  | "close"
  | "code"
  | "copy"
  | "edit"
  | "folder"
  | "globe"
  | "grid"
  | "menu"
  | "message"
  | "more"
  | "new"
  | "search"
  | "settings"
  | "sparkles"
  | "thumb"
  | "trash"
  | "user";

type View = "chats" | "spaces" | "library" | "all";
type Modal = "search" | "updates" | "settings" | "pro" | null;
type Model = "Универсальный" | "Эксперт";
type Message = { id: string; role: "user" | "assistant"; text: string; pending?: boolean };
type Chat = { id: string; title: string; time: string; messages: Message[] };

const paths: Record<IconName, ReactNode> = {
  archive: <path d="M4 7h16M5 7l1 13h12l1-13M9 11h6M7 4h10l1 3H6l1-3Z" />,
  arrow: <path d="m12 19 7-7-7-7M19 12H5" />,
  attachment: (
    <path d="m20.5 11.5-8.8 8.8a6 6 0 0 1-8.5-8.5L13 2a4 4 0 0 1 5.7 5.7l-9.9 9.9a2 2 0 0 1-2.8-2.8l9.2-9.2" />
  ),
  book: (
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5v-16ZM20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5v-16Z" />
  ),
  check: <path d="m5 12 4 4L19 6" />,
  chevron: <path d="m9 18 6-6-6-6" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  code: <path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14" />,
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M15 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3" />
    </>
  ),
  edit: <path d="m14 5 5 5M4 20l3.5-.7L19 7.8a2 2 0 0 0 0-2.8 2 2 0 0 0-2.8 0L4.7 16.5 4 20Z" />,
  folder: <path d="M3 6.5h6l2 2h10v10H3v-12Z" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3.4 3 14.6 0 18M12 3c-3 3.4-3 14.6 0 18" />
    </>
  ),
  grid: (
    <>
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <rect x="14" y="14" width="6" height="6" rx="1" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  message: <path d="M5 5h14v11H9l-4 4V5Z" />,
  more: (
    <>
      <circle cx="5" cy="12" r="1" fill="currentColor" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <circle cx="19" cy="12" r="1" fill="currentColor" />
    </>
  ),
  new: <path d="M12 5v14M5 12h14" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a2 2 0 0 0 .4 2.2l.1.1-2.6 2.6-.1-.1a2 2 0 0 0-2.2-.4 2 2 0 0 0-1.2 1.8V21h-3.6v-.2A2 2 0 0 0 9 19a2 2 0 0 0-2.2.4l-.1.1-2.6-2.6.1-.1a2 2 0 0 0 .4-2.2A2 2 0 0 0 2.8 13H2v-3.6h.8A2 2 0 0 0 4.6 8a2 2 0 0 0-.4-2.2l-.1-.1 2.6-2.6.1.1A2 2 0 0 0 9 3.6 2 2 0 0 0 10.2 2h3.6A2 2 0 0 0 15 3.6a2 2 0 0 0 2.2-.4l.1-.1 2.6 2.6-.1.1a2 2 0 0 0-.4 2.2 2 2 0 0 0 1.8 1.2h.8v3.6h-.8a2 2 0 0 0-1.8 1.2Z" />
    </>
  ),
  sparkles: (
    <path d="M12 3c.4 3 2 4.6 5 5-3 .4-4.6 2-5 5-.4-3-2-4.6-5-5 3-.4 4.6-2 5-5ZM18 15c.2 1.7 1.1 2.6 2.8 2.8-1.7.2-2.6 1.1-2.8 2.8-.2-1.7-1.1-2.6-2.8-2.8 1.7-.2 2.6-1.1 2.8-2.8ZM5 15c.2 1.2.8 1.8 2 2-1.2.2-1.8.8-2 2-.2-1.2-.8-1.8-2-2 1.2-.2 1.8-.8 2-2Z" />
  ),
  thumb: (
    <path d="M7 10v10H3V10h4Zm0 9h10.5a2 2 0 0 0 1.9-1.4l1.4-5A2 2 0 0 0 18.9 10H14l.8-3.8A2.7 2.7 0 0 0 12.2 3L7 10v9Z" />
  ),
  trash: <path d="M4 7h16M9 7V4h6v3m3 0-1 14H7L6 7m4 4v6m4-6v6" />,
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
};

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

const answerText =
  "Предлагаю начать с ясной структуры: определить цель, выделить ключевые ограничения и разбить работу на короткие проверяемые этапы. Так мы быстрее получим сильный результат и сможем улучшать его по обратной связи.";

const initialChats: Chat[] = [
  {
    id: "launch",
    title: "Стратегия запуска продукта",
    time: "Сейчас",
    messages: [
      {
        id: "launch-u",
        role: "user",
        text: "Помоги составить стратегию запуска нового цифрового продукта.",
      },
      { id: "launch-a", role: "assistant", text: answerText },
    ],
  },
  {
    id: "edtech",
    title: "Анализ рынка EdTech",
    time: "Вчера",
    messages: [
      {
        id: "edtech-u",
        role: "user",
        text: "Какие тренды сейчас определяют развитие рынка EdTech?",
      },
      {
        id: "edtech-a",
        role: "assistant",
        text: "Главные направления — персонализация обучения, AI-наставники, микрообучение и измеримый прогресс. Для глубокого анализа стоит разделить рынок на B2C, корпоративное обучение и инструменты для образовательных организаций.",
      },
    ],
  },
  {
    id: "deck",
    title: "Идеи для презентации",
    time: "Вт",
    messages: [
      {
        id: "deck-u",
        role: "user",
        text: "Предложи структуру убедительной презентации для инвесторов.",
      },
      {
        id: "deck-a",
        role: "assistant",
        text: "Начните с проблемы и масштаба возможности, затем покажите продукт в действии, подтверждение спроса, бизнес-модель, рынок, команду и конкретный запрос к инвестору.",
      },
    ],
  },
];

const suggestions = [
  {
    icon: "edit" as IconName,
    title: "Создать контент",
    text: "Напиши структуру статьи о технологиях",
  },
  { icon: "code" as IconName, title: "Разобрать код", text: "Найди ошибку и предложи улучшения" },
  {
    icon: "globe" as IconName,
    title: "Исследовать тему",
    text: "Собери ключевые факты и источники",
  },
];

const libraryItems = [
  {
    icon: "edit" as IconName,
    title: "Редактор текста",
    text: "Улучшает стиль, структуру и ясность текста",
    prompt: "Помоги отредактировать мой текст",
  },
  {
    icon: "code" as IconName,
    title: "Code review",
    text: "Проверяет код и предлагает улучшения",
    prompt: "Проведи code review и объясни замечания",
  },
  {
    icon: "globe" as IconName,
    title: "Deep research",
    text: "Создаёт план комплексного исследования",
    prompt: "Составь план глубокого исследования темы",
  },
  {
    icon: "book" as IconName,
    title: "Конспект",
    text: "Превращает материал в короткий конспект",
    prompt: "Сделай структурированный конспект материала",
  },
];

function Logo() {
  return (
    <div className="logo">
      <span className="logo-mark">
        <span />
        <span />
        <span />
      </span>
      <span>Astra</span>
    </div>
  );
}

function Sidebar({
  open,
  collapsed,
  view,
  chats,
  activeId,
  historyOpen,
  onClose,
  onCollapse,
  onNewChat,
  onNavigate,
  onSelectChat,
  onToggleHistory,
  onOpenModal,
  onDelete,
}: {
  open: boolean;
  collapsed: boolean;
  view: View;
  chats: Chat[];
  activeId: string | null;
  historyOpen: boolean;
  onClose: () => void;
  onCollapse: () => void;
  onNewChat: () => void;
  onNavigate: (view: View) => void;
  onSelectChat: (id: string) => void;
  onToggleHistory: () => void;
  onOpenModal: (modal: Modal) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <>
      <div className={`scrim ${open ? "visible" : ""}`} onClick={onClose} />
      <aside className={`sidebar ${open ? "open" : ""} ${collapsed ? "collapsed" : ""}`}>
        <div className="side-top">
          <Logo />
          <button
            className="icon-button desktop-collapse"
            onClick={onCollapse}
            aria-label={collapsed ? "Развернуть меню" : "Свернуть меню"}
          >
            <Icon name="menu" />
          </button>
          <button className="icon-button mobile-close" onClick={onClose} aria-label="Закрыть меню">
            <Icon name="close" />
          </button>
        </div>
        <button className="new-chat" onClick={onNewChat} title="Новый диалог">
          <Icon name="new" />
          <span>Новый диалог</span>
          <kbd>⌘ K</kbd>
        </button>
        <nav className="main-nav" aria-label="Основная навигация">
          <button onClick={() => onOpenModal("search")} title="Поиск">
            <Icon name="search" />
            <span>Поиск</span>
          </button>
          <button
            className={view === "chats" || view === "all" ? "active" : ""}
            onClick={() => onNavigate("chats")}
            title="Диалоги"
          >
            <Icon name="message" />
            <span>Диалоги</span>
            <span className="nav-count">{chats.length}</span>
          </button>
          <button
            className={view === "spaces" ? "active" : ""}
            onClick={() => onNavigate("spaces")}
            title="Пространства"
          >
            <Icon name="folder" />
            <span>Пространства</span>
          </button>
          <button
            className={view === "library" ? "active" : ""}
            onClick={() => onNavigate("library")}
            title="Библиотека"
          >
            <Icon name="grid" />
            <span>Библиотека</span>
          </button>
        </nav>
        <div className={`history ${historyOpen ? "" : "history-hidden"}`}>
          <div className="section-title">
            <span>Недавние</span>
            <button
              onClick={onToggleHistory}
              aria-label={historyOpen ? "Скрыть недавние" : "Показать недавние"}
            >
              <Icon name="chevron" size={14} />
            </button>
          </div>
          <div className="history-list">
            {chats.slice(0, 3).map((chat) => (
              <div className={`chat-item ${activeId === chat.id ? "selected" : ""}`} key={chat.id}>
                <button className="chat-main" onClick={() => onSelectChat(chat.id)}>
                  <span className="chat-dot" />
                  <span className="chat-copy">
                    <span>{chat.title}</span>
                    <small>{chat.time}</small>
                  </span>
                </button>
                <button
                  className="chat-delete"
                  onClick={() => onDelete(chat.id)}
                  aria-label={`Удалить ${chat.title}`}
                >
                  <Icon name="trash" size={14} />
                </button>
              </div>
            ))}
            <button className="all-chats" onClick={() => onNavigate("all")}>
              Все диалоги <Icon name="arrow" size={14} />
            </button>
          </div>
        </div>
        <div className="sidebar-footer">
          <button className="upgrade" onClick={() => onOpenModal("pro")} title="Astra Pro">
            <span className="upgrade-icon">
              <Icon name="sparkles" size={16} />
            </span>
            <span>
              <b>Astra Pro</b>
              <small>Раскройте все возможности</small>
            </span>
            <Icon name="chevron" size={15} />
          </button>
          <button
            className="profile"
            onClick={() => onOpenModal("settings")}
            title="Настройки профиля"
          >
            <span className="avatar">АМ</span>
            <span>
              <b>Алексей Морозов</b>
              <small>
                <span className="online-dot" /> Онлайн
              </small>
            </span>
            <Icon name="settings" size={17} />
          </button>
        </div>
      </aside>
    </>
  );
}

function Composer({
  onSend,
  compact = false,
}: {
  onSend: (value: string) => void;
  compact?: boolean;
}) {
  const [value, setValue] = useState("");
  const [attachOpen, setAttachOpen] = useState(false);
  const [webSearch, setWebSearch] = useState(false);
  const [attachment, setAttachment] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    if (!value.trim()) return;
    const extras = [
      webSearch ? "Веб-поиск включён" : "",
      attachment ? `Вложение: ${attachment}` : "",
    ].filter(Boolean);
    onSend(`${value.trim()}${extras.length ? `\n\n[${extras.join(" · ")}]` : ""}`);
    setValue("");
    setAttachment("");
    setAttachOpen(false);
  };
  const upload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setAttachment(file.name);
    setAttachOpen(false);
  };
  const addLink = () => {
    const link = window.prompt("Вставьте ссылку на источник");
    if (link?.trim()) setAttachment(link.trim());
    setAttachOpen(false);
  };

  return (
    <form className={`composer ${compact ? "compact" : ""}`} onSubmit={submit}>
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            submit();
          }
        }}
        rows={1}
        placeholder="Напишите сообщение..."
        aria-label="Сообщение"
      />
      {attachment && (
        <button type="button" className="attachment-chip" onClick={() => setAttachment("")}>
          {attachment}
          <Icon name="close" size={12} />
        </button>
      )}
      <div className="composer-actions">
        <div className="attachment-wrap">
          <input ref={inputRef} type="file" hidden onChange={upload} />
          <button
            type="button"
            className="tool-button"
            onClick={() => setAttachOpen(!attachOpen)}
            aria-label="Прикрепить файл"
            aria-expanded={attachOpen}
          >
            <Icon name="attachment" />
          </button>
          {attachOpen && (
            <div className="attach-menu">
              <button type="button" onClick={() => inputRef.current?.click()}>
                <Icon name="folder" /> Загрузить файл
              </button>
              <button type="button" onClick={addLink}>
                <Icon name="globe" /> Добавить ссылку
              </button>
            </div>
          )}
        </div>
        <button
          type="button"
          className={`tool-button ${webSearch ? "enabled" : ""}`}
          onClick={() => setWebSearch(!webSearch)}
          aria-pressed={webSearch}
        >
          <Icon name="globe" />
          <span>Веб-поиск</span>
          {webSearch && <Icon name="check" size={12} />}
        </button>
      </div>
      <div className="composer-right">
        <span className="key-hint">↵ отправить</span>
        <button
          type="submit"
          className={`send-button ${value.trim() ? "ready" : ""}`}
          disabled={!value.trim()}
          aria-label="Отправить"
        >
          <Icon name="arrow" size={19} />
        </button>
      </div>
    </form>
  );
}

function EmptyState({ onPrompt }: { onPrompt: (value: string) => void }) {
  return (
    <section className="empty-state">
      <div className="orb" aria-hidden="true">
        <div className="orb-core">
          <Icon name="sparkles" size={30} />
        </div>
      </div>
      <h1>
        Чем я могу <span>помочь?</span>
      </h1>
      <div className="suggestions">
        {suggestions.map((item) => (
          <button key={item.title} onClick={() => onPrompt(item.text)}>
            <span className="suggestion-icon">
              <Icon name={item.icon} />
            </span>
            <span>
              <b>{item.title}</b>
              <small>{item.text}</small>
            </span>
            <Icon name="arrow" size={16} />
          </button>
        ))}
      </div>
      <Composer onSend={onPrompt} />
      <p className="disclaimer">Astra может допускать ошибки. Проверяйте важную информацию.</p>
    </section>
  );
}

function ActiveChat({
  chat,
  onSend,
  onCopy,
  onFeedback,
}: {
  chat: Chat;
  onSend: (value: string) => void;
  onCopy: (text: string) => void;
  onFeedback: () => void;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), [chat.messages]);

  return (
    <section className="conversation">
      <div className="messages">
        {chat.messages.map((message) =>
          message.role === "user" ? (
            <div className="user-message" key={message.id}>
              <div className="message-avatar user-avatar">АМ</div>
              <div>
                <div className="message-meta">
                  <b>Вы</b>
                  <span>сейчас</span>
                </div>
                <p>{message.text}</p>
              </div>
            </div>
          ) : (
            <div className="ai-message" key={message.id}>
              <div className="message-avatar ai-avatar">
                <Icon name="sparkles" size={17} />
              </div>
              <div className="ai-content">
                <div className="message-meta">
                  <b>Astra</b>
                  <span className="verified">AI</span>
                </div>
                {message.pending ? (
                  <div className="typing">
                    <i />
                    <i />
                    <i />
                    <span>Анализирую запрос</span>
                  </div>
                ) : (
                  <>
                    <p>{message.text}</p>
                    <div className="insight-card">
                      <span>01</span>
                      <div>
                        <b>Сфокусируйтесь на результате</b>
                        <p>
                          Сформулируйте один измеримый результат, который должен получить
                          пользователь.
                        </p>
                      </div>
                    </div>
                    <div className="insight-card">
                      <span>02</span>
                      <div>
                        <b>Проверяйте небольшими итерациями</b>
                        <p>Собирайте обратную связь после каждого завершённого этапа.</p>
                      </div>
                    </div>
                    <div className="answer-actions">
                      <button onClick={() => onCopy(message.text)}>
                        <Icon name="copy" size={15} /> Копировать
                      </button>
                      <button onClick={onFeedback} aria-label="Полезный ответ">
                        <Icon name="thumb" size={15} />
                      </button>
                      <button
                        onClick={() => onSend("Продолжи и добавь больше практических деталей")}
                      >
                        <Icon name="more" size={16} /> Подробнее
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ),
        )}
        <div ref={bottomRef} />
      </div>
      <div className="conversation-composer">
        <Composer compact onSend={onSend} />
        <p className="disclaimer">Astra может допускать ошибки. Проверяйте важную информацию.</p>
      </div>
    </section>
  );
}

function CollectionView({
  view,
  chats,
  spaces,
  onSelectChat,
  onCreateSpace,
  onUseTemplate,
}: {
  view: Exclude<View, "chats">;
  chats: Chat[];
  spaces: string[];
  onSelectChat: (id: string) => void;
  onCreateSpace: () => void;
  onUseTemplate: (prompt: string) => void;
}) {
  if (view === "all") {
    return (
      <section className="page-view">
        <div className="page-heading">
          <div>
            <p>История</p>
            <h1>Все диалоги</h1>
          </div>
          <span>{chats.length} диалога</span>
        </div>
        <div className="chat-table">
          {chats.map((chat) => (
            <button key={chat.id} onClick={() => onSelectChat(chat.id)}>
              <span className="table-icon">
                <Icon name="message" />
              </span>
              <span>
                <b>{chat.title}</b>
                <small>{chat.messages.at(-1)?.text}</small>
              </span>
              <time>{chat.time}</time>
              <Icon name="chevron" size={16} />
            </button>
          ))}
        </div>
      </section>
    );
  }
  if (view === "spaces") {
    return (
      <section className="page-view">
        <div className="page-heading">
          <div>
            <p>Командная работа</p>
            <h1>Пространства</h1>
          </div>
          <button className="primary-action" onClick={onCreateSpace}>
            <Icon name="new" /> Создать
          </button>
        </div>
        <div className="space-grid">
          {spaces.map((space, index) => (
            <button
              className="space-card"
              key={space}
              onClick={() => onUseTemplate(`Помоги начать работу в пространстве «${space}»`)}
            >
              <span className="space-art">
                <Icon name={index % 2 ? "code" : "folder"} size={24} />
              </span>
              <span>
                <b>{space}</b>
                <small>{index + 2} диалога · обновлено недавно</small>
              </span>
              <Icon name="chevron" />
            </button>
          ))}
        </div>
      </section>
    );
  }
  return (
    <section className="page-view">
      <div className="page-heading">
        <div>
          <p>Готовые сценарии</p>
          <h1>Библиотека</h1>
        </div>
        <span>{libraryItems.length} инструмента</span>
      </div>
      <div className="library-grid">
        {libraryItems.map((item) => (
          <button key={item.title} onClick={() => onUseTemplate(item.prompt)}>
            <span className="library-icon">
              <Icon name={item.icon} />
            </span>
            <b>{item.title}</b>
            <p>{item.text}</p>
            <small>
              Открыть <Icon name="arrow" size={13} />
            </small>
          </button>
        ))}
      </div>
    </section>
  );
}

function ModalLayer({
  modal,
  chats,
  theme,
  onClose,
  onSelectChat,
  onTheme,
  onToast,
}: {
  modal: Modal;
  chats: Chat[];
  theme: string;
  onClose: () => void;
  onSelectChat: (id: string) => void;
  onTheme: (theme: string) => void;
  onToast: (message: string) => void;
}) {
  const [query, setQuery] = useState("");
  if (!modal) return null;
  const results = chats.filter((chat) =>
    `${chat.title} ${chat.messages.map((item) => item.text).join(" ")}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className={`modal-card ${modal === "updates" ? "updates-modal" : ""}`}
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-head">
          <div>
            <span className="modal-kicker">
              {modal === "search"
                ? "Навигация"
                : modal === "updates"
                  ? "Версия 2.0"
                  : modal === "pro"
                    ? "Премиум"
                    : "Профиль"}
            </span>
            <h2>
              {modal === "search"
                ? "Поиск по диалогам"
                : modal === "updates"
                  ? "Что нового в Astra"
                  : modal === "pro"
                    ? "Работайте без ограничений"
                    : "Настройки"}
            </h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Закрыть">
            <Icon name="close" />
          </button>
        </div>
        {modal === "search" && (
          <>
            <label className="search-field">
              <Icon name="search" />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Название или текст сообщения..."
              />
              <kbd>ESC</kbd>
            </label>
            <div className="search-results">
              {results.map((chat) => (
                <button key={chat.id} onClick={() => onSelectChat(chat.id)}>
                  <Icon name="message" />
                  <span>
                    <b>{chat.title}</b>
                    <small>{chat.messages.at(-1)?.text}</small>
                  </span>
                  <Icon name="arrow" />
                </button>
              ))}
              {!results.length && <p>Ничего не найдено. Попробуйте другой запрос.</p>}
            </div>
          </>
        )}
        {modal === "updates" && (
          <div className="updates-list">
            <div>
              <span>Новое</span>
              <b>Пространства для проектов</b>
              <p>Объединяйте связанные диалоги и контекст в одном месте.</p>
            </div>
            <div>
              <span>2.0</span>
              <b>Экспертный режим</b>
              <p>Больше глубины для аналитических и технических задач.</p>
            </div>
            <div>
              <span>UI</span>
              <b>Быстрее и спокойнее</b>
              <p>Обновили навигацию, поиск и визуальную обратную связь.</p>
            </div>
          </div>
        )}
        {modal === "settings" && (
          <div className="settings-body">
            <div className="settings-user">
              <span className="avatar large">АМ</span>
              <div>
                <b>Алексей Морозов</b>
                <small>alexey@example.com</small>
              </div>
              <button onClick={() => onToast("Редактирование профиля открыто")}>Изменить</button>
            </div>
            <div className="setting-row">
              <div>
                <b>Оформление</b>
                <small>Выберите насыщенность фона</small>
              </div>
              <div className="segmented">
                <button
                  className={theme === "midnight" ? "active" : ""}
                  onClick={() => onTheme("midnight")}
                >
                  Midnight
                </button>
                <button
                  className={theme === "deep" ? "active" : ""}
                  onClick={() => onTheme("deep")}
                >
                  Deep blue
                </button>
              </div>
            </div>
            <div className="setting-row">
              <div>
                <b>Язык интерфейса</b>
                <small>Русский</small>
              </div>
              <button
                className="secondary-action"
                onClick={() => onToast("Язык интерфейса: русский")}
              >
                Изменить
              </button>
            </div>
          </div>
        )}
        {modal === "pro" && (
          <div className="pro-body">
            <div className="price">
              <b>1 490 ₽</b>
              <span>/ месяц</span>
            </div>
            {[
              "Экспертная модель без лимитов",
              "Расширенный веб-поиск",
              "Загрузка больших файлов",
              "Приоритетная скорость ответа",
            ].map((item) => (
              <p key={item}>
                <Icon name="check" size={16} />
                {item}
              </p>
            ))}
            <button className="pro-cta" onClick={() => onToast("Заявка на Astra Pro принята")}>
              Попробовать бесплатно
            </button>
            <small>7 дней бесплатно, отмена в любой момент</small>
          </div>
        )}
      </section>
    </div>
  );
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [view, setView] = useState<View>("chats");
  const [modal, setModal] = useState<Modal>(null);
  const [modeOpen, setModeOpen] = useState(false);
  const [model, setModel] = useState<Model>("Универсальный");
  const [historyOpen, setHistoryOpen] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem("astra-theme") || "midnight");
  const [toast, setToast] = useState("");
  const [spaces, setSpaces] = useState(["Запуск продукта", "Исследования"]);
  const [chats, setChats] = useState<Chat[]>(() => {
    try {
      const saved = localStorage.getItem("astra-chats");
      return saved ? JSON.parse(saved) : initialChats;
    } catch {
      return initialChats;
    }
  });
  const [activeId, setActiveId] = useState<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const activeChat = chats.find((chat) => chat.id === activeId);

  useEffect(() => localStorage.setItem("astra-chats", JSON.stringify(chats)), [chats]);
  useEffect(() => {
    localStorage.setItem("astra-theme", theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  useEffect(() => {
    const keyboard = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        newChat();
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "f") {
        event.preventDefault();
        setModal("search");
      }
      if (event.key === "Escape") {
        setModal(null);
        setModeOpen(false);
      }
    };
    window.addEventListener("keydown", keyboard);
    return () => {
      window.removeEventListener("keydown", keyboard);
      timers.current.forEach(clearTimeout);
    };
  }, []);

  const notify = (message: string) => {
    setToast(message);
    const timer = setTimeout(() => setToast(""), 2400);
    timers.current.push(timer);
  };
  const newChat = () => {
    setActiveId(null);
    setView("chats");
    setSidebarOpen(false);
  };
  const selectChat = (id: string) => {
    setActiveId(id);
    setView("chats");
    setModal(null);
    setSidebarOpen(false);
  };
  const navigate = (nextView: View) => {
    setView(nextView);
    setSidebarOpen(false);
  };
  const send = (value: string, forceNew = false) => {
    const now = Date.now();
    let targetId = forceNew ? null : activeId;
    if (!targetId) {
      targetId = `chat-${now}`;
      const title = value.replace(/\n.*/s, "").slice(0, 36) || "Новый диалог";
      setChats((current) => [{ id: targetId!, title, time: "Сейчас", messages: [] }, ...current]);
      setActiveId(targetId);
    }
    const userMessage: Message = { id: `u-${now}`, role: "user", text: value };
    const pending: Message = { id: `a-${now}`, role: "assistant", text: "", pending: true };
    setChats((current) =>
      current.map((chat) =>
        chat.id === targetId
          ? { ...chat, time: "Сейчас", messages: [...chat.messages, userMessage, pending] }
          : chat,
      ),
    );
    setView("chats");
    setModeOpen(false);
    const timer = setTimeout(() => {
      const response =
        model === "Эксперт"
          ? `${answerText} В экспертном режиме я также рекомендую заранее зафиксировать критерии качества, риски и набор данных для проверки каждой гипотезы.`
          : answerText;
      setChats((current) =>
        current.map((chat) =>
          chat.id === targetId
            ? {
                ...chat,
                messages: chat.messages.map((message) =>
                  message.id === pending.id
                    ? { ...message, text: response, pending: false }
                    : message,
                ),
              }
            : chat,
        ),
      );
    }, 1600);
    timers.current.push(timer);
  };
  const deleteChat = (id: string) => {
    setChats((current) => current.filter((chat) => chat.id !== id));
    if (activeId === id) setActiveId(null);
    notify("Диалог удалён");
  };
  const copyAnswer = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      notify("Ответ скопирован");
    } catch {
      notify("Не удалось скопировать ответ");
    }
  };
  const createSpace = () => {
    const name = window.prompt("Название нового пространства");
    if (name?.trim()) {
      setSpaces((current) => [...current, name.trim()]);
      notify("Пространство создано");
    }
  };

  return (
    <div className={`app-shell ${collapsed ? "sidebar-collapsed" : ""}`}>
      <Sidebar
        open={sidebarOpen}
        collapsed={collapsed}
        view={view}
        chats={chats}
        activeId={activeId}
        historyOpen={historyOpen}
        onClose={() => setSidebarOpen(false)}
        onCollapse={() => setCollapsed(!collapsed)}
        onNewChat={newChat}
        onNavigate={navigate}
        onSelectChat={selectChat}
        onToggleHistory={() => setHistoryOpen(!historyOpen)}
        onOpenModal={setModal}
        onDelete={deleteChat}
      />
      <main className="workspace">
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            onClick={() => setSidebarOpen(true)}
            aria-label="Открыть меню"
          >
            <Icon name="menu" />
          </button>
          <button
            className="model-select"
            onClick={() => setModeOpen(!modeOpen)}
            aria-expanded={modeOpen}
          >
            <span className="mini-logo">
              <Icon name={model === "Эксперт" ? "code" : "sparkles"} size={15} />
            </span>
            <span>
              <b>Astra 2.0</b>
              <small>{model} режим</small>
            </span>
            <Icon name="chevron" size={14} />
          </button>
          {modeOpen && (
            <div className="model-menu">
              <p>Режим ответа</p>
              {(["Универсальный", "Эксперт"] as Model[]).map((item) => (
                <button
                  key={item}
                  className={model === item ? "chosen" : ""}
                  onClick={() => {
                    setModel(item);
                    setModeOpen(false);
                    notify(`Включён режим «${item}»`);
                  }}
                >
                  <span>
                    <Icon name={item === "Эксперт" ? "code" : "sparkles"} />
                    <span>
                      <b>{item}</b>
                      <small>
                        {item === "Эксперт" ? "Глубокий анализ" : "Баланс скорости и качества"}
                      </small>
                    </span>
                  </span>
                  {model === item && <i />}
                </button>
              ))}
            </div>
          )}
          <div className="top-actions">
            <button className="share-button" onClick={() => setModal("updates")}>
              <Icon name="sparkles" size={16} />
              <span>Обновления</span>
            </button>
          </div>
        </header>
        <div className="ambient one" />
        <div className="ambient two" />
        {view === "chats" ? (
          activeChat ? (
            <ActiveChat
              chat={activeChat}
              onSend={send}
              onCopy={copyAnswer}
              onFeedback={() => notify("Спасибо за обратную связь")}
            />
          ) : (
            <EmptyState onPrompt={send} />
          )
        ) : (
          <CollectionView
            view={view}
            chats={chats}
            spaces={spaces}
            onSelectChat={selectChat}
            onCreateSpace={createSpace}
            onUseTemplate={(prompt) => send(prompt, true)}
          />
        )}
      </main>
      <ModalLayer
        modal={modal}
        chats={chats}
        theme={theme}
        onClose={() => setModal(null)}
        onSelectChat={selectChat}
        onTheme={setTheme}
        onToast={notify}
      />
      {toast && (
        <div className="toast">
          <Icon name="check" size={16} />
          {toast}
        </div>
      )}
    </div>
  );
}
