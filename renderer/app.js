const populatedBooks = [
  { title: "پست شبانه عادت" },
  { title: "انسان در جستجوی معنا" },
  { title: "ملت عشق" },
  { title: "سقوط" },
  { title: "بادبادک‌باز" }
];

const forceEmptyDashboard =
  new URLSearchParams(window.location.search).get("state") === "empty" ||
  window.location.hash === "#empty";

const dashboardData = {
  books: forceEmptyDashboard ? [] : populatedBooks,
  menuItems: [
    { label: "داشبورد", icon: "grid", active: true },
    { label: "کتاب‌ها", icon: "book", active: false },
    { label: "امانت‌ها", icon: "repeat", active: false },
    { label: "امانت‌گیرندگان", icon: "users", active: false },
    { label: "تنظیمات", icon: "settings", active: false }
  ],
  quickActions: [
    { label: "افزودن کتاب", icon: "plusSquare", action: "add-book" },
    { label: "ثبت امانت", icon: "repeat", action: "borrow-book" },
    { label: "جستجوی کتاب", icon: "search", action: "search-book" },
    { label: "امانت‌گیرندگان", icon: "users", action: "borrowers" }
  ],
  dueBooks: [
    {
      title: "پست شبانه عادت",
      author: "جیمز کلیر",
      borrower: "رضا حسینی",
      dueDate: "۱۴۰۴/۰۲/۲۶",
      coverClass: "cover-night"
    },
    {
      title: "انسان در جستجوی معنا",
      author: "ویکتور فرانکل",
      borrower: "سارا محمدی",
      dueDate: "۱۴۰۴/۰۲/۲۴",
      coverClass: "cover-bird"
    },
    {
      title: "ملت عشق",
      author: "الیف شافاک",
      borrower: "امیرحسین رضایی",
      dueDate: "۱۴۰۴/۰۲/۲۳",
      coverClass: "cover-love"
    }
  ],
  newBooks: [
    { title: "سقوط", author: "آلبر کامو", date: "۱۴۰۴/۰۳/۲۱", coverClass: "cover-fall" },
    { title: "بادبادک‌باز", author: "خالد حسینی", date: "۱۴۰۴/۰۳/۱۹", coverClass: "cover-kite" },
    { title: "جزیره", author: "آلدوس هاکسلی", date: "۱۴۰۴/۰۲/۱۸", coverClass: "cover-island" },
    { title: "شازده کوچولو", author: "آنتوان دوسنت...", date: "۱۴۰۴/۰۲/۱۶", coverClass: "cover-prince" },
    { title: "خرده عادت‌ها", author: "جیمز کلیر", date: "۱۴۰۴/۰۱/۱۵", coverClass: "cover-atomic" }
  ],
  activities: [
    { text: "امانت «ملت عشق» به امیرحسین رضایی", time: "امروز، ۱۰:۲۴", icon: "user", tone: "orange" },
    { text: "بازگشت «گرگ و میش» توسط نرگس موسوی", time: "دیروز، ۱۸:۴۲", icon: "checkCircle", tone: "green" },
    { text: "افزودن کتاب جدید «بادبادک‌باز»", time: "دیروز، ۱۶:۱۰", icon: "plusCircle", tone: "blue" },
    { text: "امانت «انسان در جستجوی معنا» به سارا محمدی", time: "۱۴۰۴/۰۲/۳۰، ۱۲:۳۵", icon: "user", tone: "orange" },
    { text: "ویرایش اطلاعات کتاب «شازده کوچولو»", time: "۱۴۰۴/۰۲/۲۹، ۰۹:۱۸", icon: "pen", tone: "blue" }
  ]
};

const iconPaths = {
  alertTriangle: '<path d="M10.3 3.1 1.8 17.6a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.1a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5Z"/>',
  bookOpen: '<path d="M12 7v14"/><path d="M3 18.5A2.5 2.5 0 0 1 5.5 16H12V5H5.5A2.5 2.5 0 0 0 3 7.5v11Z"/><path d="M21 18.5A2.5 2.5 0 0 0 18.5 16H12V5h6.5A2.5 2.5 0 0 1 21 7.5v11Z"/>',
  bookmark: '<path d="M6 4.5A2.5 2.5 0 0 1 8.5 2h7A2.5 2.5 0 0 1 18 4.5V22l-6-3-6 3V4.5Z"/>',
  calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><path d="M3 10h18"/><rect x="3" y="4" width="18" height="18" rx="2"/>',
  checkCircle: '<path d="M22 11.1V12a10 10 0 1 1-5.9-9.1"/><path d="m9 11 3 3L22 4"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  lightbulb: '<path d="M15 14c.2-1 .8-1.8 1.5-2.6A6 6 0 1 0 7.5 11.4C8.2 12.2 8.8 13 9 14"/><path d="M9 18h6"/><path d="M10 22h4"/><path d="M10 14h4v4h-4z"/>',
  pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z"/>',
  plusCircle: '<circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/>',
  plusSquare: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M12 8v8"/><path d="M8 12h8"/>',
  repeat: '<path d="m17 2 4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  settings: '<path d="M12.2 2h-.4l-1 3.1a7 7 0 0 0-1.7 1L5.8 5 3.6 8.8l2.4 2.2a7 7 0 0 0 0 2L3.6 15.2 5.8 19l3.3-1.1a7 7 0 0 0 1.7 1l1 3.1h.4l1-3.1a7 7 0 0 0 1.7-1l3.3 1.1 2.2-3.8-2.4-2.2a7 7 0 0 0 0-2l2.4-2.2L18.2 5l-3.3 1.1a7 7 0 0 0-1.7-1L12.2 2Z"/><circle cx="12" cy="12" r="3"/>',
  user: '<path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/>',
  userPlus: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6"/><path d="M16 11h6"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/>'
};

function Icon(name, className = "") {
  return `
    <svg class="icon ${className}" viewBox="0 0 24 24" aria-hidden="true">
      ${iconPaths[name] || ""}
    </svg>
  `;
}

function getStats(isEmpty) {
  if (isEmpty) {
    return [
      { title: "کل کتاب‌ها", value: "۰", subtitle: "هنوز کتابی ثبت نشده است", icon: "bookOpen", tone: "blue" },
      { title: "کتاب‌های موجود", value: "۰", subtitle: "هنوز کتابی ثبت نشده است", icon: "checkCircle", tone: "green" },
      { title: "امانت‌های فعال", value: "۰", subtitle: "هنوز امانتی ثبت نشده است", icon: "user", tone: "orange" },
      { title: "کتاب‌های دیرکرد", value: "۰", subtitle: "هنوز موردی وجود ندارد", icon: "alertTriangle", tone: "red" }
    ];
  }

  return [
    { title: "کل کتاب‌ها", value: "۵۴۸", unit: "کتاب", subtitle: "در کتابخانه شخصی شما", icon: "bookOpen", tone: "blue" },
    { title: "کتاب‌های موجود", value: "۳۲۴", unit: "کتاب", subtitle: "از مجموع کتاب‌ها", icon: "checkCircle", tone: "green" },
    { title: "امانت‌های فعال", value: "۱۲", unit: "کتاب", subtitle: "به ۶ نفر امانت داده شده", icon: "user", tone: "orange" },
    { title: "کتاب‌های دیرکرد", value: "۷", unit: "کتاب", detail: "۳ امانت دیرکرد", icon: "alertTriangle", tone: "red", alert: true }
  ];
}

function DashboardPage() {
  const isEmpty = dashboardData.books.length === 0;

  return `
    <div class="dashboard-shell${isEmpty ? " is-empty-dashboard" : ""}" dir="rtl">
      ${Sidebar({ isEmpty })}
      <main class="dashboard-main">
        ${DashboardHeader({ isEmpty })}
        <section class="stats-grid" aria-label="آمار کتابخانه">
          ${getStats(isEmpty).map(StatsCard).join("")}
        </section>
        ${
          isEmpty
            ? `${EmptyDashboardHero()}<section class="empty-lower-grid">${EmptyStateCard("books")}${EmptyStateCard("activities")}${GettingStartedGuide()}</section>`
            : `<section class="dashboard-grid dashboard-grid-middle">${QuickActions()}${DueBooks()}</section><section class="dashboard-grid dashboard-grid-bottom">${NewBooks()}${RecentActivities()}</section>`
        }
      </main>
    </div>
    <div id="toastHost" class="toast-host" aria-live="polite" aria-atomic="true"></div>
  `;
}

function Sidebar({ isEmpty }) {
  const menu = dashboardData.menuItems.map((item) => `
    <button class="sidebar-link${item.active ? " is-active" : ""}" type="button" data-action="nav" data-label="${item.label}">
      ${Icon(item.icon)}
      <span>${item.label}</span>
    </button>
  `).join("");

  return `
    <aside class="app-sidebar" aria-label="ناوبری اصلی">
      <div class="sidebar-top">
        <div class="brand-block">
          <div class="brand-mark">${Icon("bookOpen")}</div>
          <div>
            <p>سامانه مدیریت</p>
            <strong>کتابخانه شخصی</strong>
          </div>
        </div>
        <nav class="sidebar-nav">
          ${menu}
        </nav>
      </div>
      ${isEmpty ? `<div class="sidebar-status"><span>نسخه ۱.۰.۰</span><strong><i></i>آنلاین</strong></div>` : ""}
    </aside>
  `;
}

function DashboardHeader({ isEmpty }) {
  return `
    <header class="dashboard-header">
      <div class="page-heading">
        <h1>داشبورد</h1>
        <p>${isEmpty ? "شروع مدیریت کتابخانه شخصی شما" : "نمای کلی از وضعیت کتابخانه شخصی شما"}</p>
      </div>
      <div class="header-actions" aria-label="ابزارهای داشبورد">
        <button class="primary-action" type="button" data-action="add-book">
          <span class="plus-glyph">+</span>
          <span>${isEmpty ? "افزودن اولین کتاب" : "افزودن کتاب"}</span>
        </button>
        ${
          isEmpty
            ? `<button class="secondary-action" type="button" data-action="settings">${Icon("settings")}<span>تنظیمات اولیه</span></button>`
            : `<button class="filter-action" type="button" data-action="filter">${Icon("chevronDown", "filter-chevron")}<span>فیلتر</span></button>`
        }
        <label class="search-field" for="dashboardSearch">
          ${Icon("search")}
          <input id="dashboardSearch" type="search" placeholder="جستجو در عنوان، نویسنده، ناشر، ISBN..." autocomplete="off" />
        </label>
      </div>
    </header>
  `;
}

function StatsCard(card) {
  return `
    <article class="stats-card stats-card-${card.tone}">
      <div class="stats-copy">
        <h2>${card.title}</h2>
        <strong>${card.value}</strong>
        ${card.unit ? `<span>${card.unit}</span>` : ""}
        ${card.subtitle ? `<p class="${card.alert ? "danger-note" : ""}">${card.subtitle}</p>` : ""}
        ${card.detail ? `<small>${card.detail}</small>` : ""}
      </div>
      <div class="stats-icon">${Icon(card.icon)}</div>
    </article>
  `;
}

function EmptyDashboardHero() {
  return `
    <section class="empty-hero panel">
      <div class="empty-illustration" aria-hidden="true">
        <span class="spark spark-a"></span>
        <span class="spark spark-b"></span>
        <span class="empty-shelf">
          <i></i><i></i><i></i><i></i>
        </span>
        <span class="empty-plant"></span>
        <span class="empty-box"><i></i></span>
        <span class="doodle-line"></span>
      </div>
      <div class="empty-hero-copy">
        <h2>هنوز کتابی ثبت نشده است</h2>
        <p>به نظر می‌رسد کتابخانه شما هنوز خالی است.</p>
        <p>با افزودن اولین کتاب و ثبت امانت‌ها، اطلاعات و فعالیت‌ها در اینجا نمایش داده می‌شود.</p>
        <div class="empty-hero-actions">
          <button class="primary-action" type="button" data-action="add-book"><span class="plus-glyph">+</span><span>افزودن اولین کتاب</span></button>
          <button class="secondary-action" type="button" data-action="borrowers">${Icon("userPlus")}<span>تعریف امانت‌گیرنده</span></button>
          <button class="secondary-action" type="button" data-action="settings">${Icon("settings")}<span>تنظیمات برنامه</span></button>
        </div>
      </div>
    </section>
  `;
}

function QuickActions() {
  const actions = dashboardData.quickActions.map((action) => `
    <button class="quick-action" type="button" data-action="${action.action}">
      ${Icon(action.icon)}
      <span>${action.label}</span>
    </button>
  `).join("");

  return `
    <section class="panel quick-panel">
      <div class="panel-header">
        <h2>دسترسی سریع</h2>
      </div>
      <div class="quick-grid">${actions}</div>
    </section>
  `;
}

function DueBooks() {
  return `
    <section class="panel due-panel">
      <div class="panel-header">
        <h2>کتاب‌های در حال سررسید</h2>
        <button class="pill-button" type="button" data-action="view-due">همه</button>
      </div>
      <div class="due-books-grid">
        ${dashboardData.dueBooks.map(DueBookCard).join("")}
      </div>
    </section>
  `;
}

function DueBookCard(book) {
  return `
    <article class="due-book-card">
      <div class="book-cover due-cover ${book.coverClass}">
        <span>${book.title}</span>
        <small>${book.author}</small>
      </div>
      <div class="due-book-copy">
        <h3>${book.title}</h3>
        <p>${book.author}</p>
        <span class="borrower-line">${Icon("user")} ${book.borrower}</span>
        <span class="date-badge">${Icon("calendar")} ${book.dueDate}</span>
      </div>
    </article>
  `;
}

function NewBooks() {
  return `
    <section class="panel new-books-panel">
      <div class="panel-header">
        <h2>جدیدترین کتاب‌ها</h2>
        <button class="pill-button" type="button" data-action="view-books">همه</button>
      </div>
      <div class="new-books-track">${dashboardData.newBooks.map(NewBookTile).join("")}</div>
    </section>
  `;
}

function NewBookTile(book) {
  return `
    <article class="new-book-tile">
      <div class="book-cover new-cover ${book.coverClass}">
        <span>${book.title}</span>
        <small>${book.author}</small>
      </div>
      <h3>${book.title}</h3>
      <p>${book.author}</p>
      <time>${book.date}</time>
      <span class="bookmark-mark">${Icon("bookmark")}</span>
    </article>
  `;
}

function RecentActivities() {
  const rows = dashboardData.activities.map((activity) => `
    <li class="activity-row">
      <span class="activity-icon activity-${activity.tone}">${Icon(activity.icon)}</span>
      <p>${activity.text}</p>
      <time>${activity.time}</time>
    </li>
  `).join("");

  return `
    <section class="panel activities-panel">
      <div class="panel-header">
        <h2>فعالیت‌های اخیر</h2>
      </div>
      <ul class="activity-list">${rows}</ul>
      <button class="activity-more" type="button" data-action="view-activities">
        ${Icon("clock")}
        <span>مشاهده همه فعالیت‌ها</span>
      </button>
    </section>
  `;
}

function EmptyStateCard(type) {
  const config = {
    books: {
      title: "کتاب‌های اخیر",
      pill: "هیچ موردی وجود ندارد",
      icon: "bookOpen",
      heading: "هنوز کتابی اضافه نکرده‌اید",
      text: "بعد از افزودن کتاب‌ها، آخرین موارد در اینجا نمایش داده می‌شود.",
      button: "افزودن اولین کتاب",
      action: "add-book",
      buttonIcon: "plusCircle"
    },
    activities: {
      title: "فعالیت‌های اخیر",
      pill: "هیچ فعالیتی وجود ندارد",
      icon: "clock",
      heading: "هنوز فعالیتی ثبت نشده است",
      text: "بعد از ثبت امانت‌ها و عملیات، فعالیت‌های اخیر در اینجا نمایش داده می‌شود.",
      button: "ثبت اولین امانت",
      action: "borrow-book",
      buttonIcon: "userPlus"
    }
  }[type];

  return `
    <section class="panel empty-state-card">
      <div class="panel-header">
        <h2>${config.title}</h2>
        <span class="empty-pill">${config.pill}</span>
      </div>
      <div class="empty-card-body">
        <span class="empty-card-icon">${Icon(config.icon)}</span>
        <h3>${config.heading}</h3>
        <p>${config.text}</p>
        <button class="outline-action" type="button" data-action="${config.action}">
          ${Icon(config.buttonIcon)}
          <span>${config.button}</span>
        </button>
      </div>
    </section>
  `;
}

function GettingStartedGuide() {
  const steps = [
    ["افزودن اولین کتاب", "اطلاعات کتاب‌ها را ثبت کنید."],
    ["ثبت امانت‌گیرندگان", "اطلاعات افراد امانت‌گیرنده را اضافه کنید."],
    ["ثبت اولین امانت", "کتابی را به امانت دهید و مدیریت را شروع کنید."]
  ];

  return `
    <section class="panel guide-card">
      <div class="guide-header">
        <h2>راهنمای شروع</h2>
        <p>برای شروع، این مراحل ساده را دنبال کنید.</p>
      </div>
      <ol class="guide-steps">
        ${steps.map((step, index) => `
          <li>
            <span>${toPersianNumber(index + 1)}</span>
            <div>
              <strong>${step[0]}</strong>
              <p>${step[1]}</p>
            </div>
          </li>
        `).join("")}
      </ol>
      <div class="guide-hint">
        ${Icon("lightbulb")}
        <span>هر زمان خواستید، می‌توانید این راهنما را از بخش راهنما مشاهده کنید.</span>
      </div>
    </section>
  `;
}

function toPersianNumber(value) {
  const digits = "۰۱۲۳۴۵۶۷۸۹";
  return String(value).replace(/\d/g, (digit) => digits[digit]);
}

function bindDashboardEvents() {
  document.querySelectorAll("[data-action]").forEach((element) => {
    element.addEventListener("click", () => handleMockAction(element.dataset.action, element.dataset.label));
  });

  const searchInput = document.getElementById("dashboardSearch");
  searchInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && searchInput.value.trim()) {
      showToast(`جستجو برای «${searchInput.value.trim()}» در نسخه نمایشی فعال شد.`);
    }
  });
}

function handleMockAction(action, label = "") {
  const messages = {
    "add-book": "افزودن کتاب در این نسخه نمایشی هنوز به بک‌اند متصل نشده است.",
    "borrow-book": "ثبت امانت فعلا به صورت نمایشی در داشبورد قرار گرفته است.",
    "search-book": "از کادر جستجوی بالای صفحه برای جستجوی کتاب استفاده کنید.",
    borrowers: "نمای امانت‌گیرندگان در مرحله بعد به این داشبورد متصل می‌شود.",
    filter: "فیلترها فعلا نمایشی هستند.",
    settings: "تنظیمات فعلا نمایشی است.",
    "view-due": "نمایش همه کتاب‌های سررسید در نسخه بعدی فعال می‌شود.",
    "view-books": "نمای کامل جدیدترین کتاب‌ها فعلا نمایشی است.",
    "view-activities": "فهرست کامل فعالیت‌ها هنوز به داده واقعی متصل نشده است.",
    nav: `${label || "این بخش"} فعلا در همین داشبورد نمایش داده می‌شود.`
  };

  showToast(messages[action] || "این کنترل فعلا نمایشی است.");
}

function showToast(message) {
  const host = document.getElementById("toastHost");
  if (!host) {
    return;
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  host.appendChild(toast);

  window.setTimeout(() => {
    toast.classList.add("is-leaving");
    window.setTimeout(() => toast.remove(), 220);
  }, 2800);
}

document.addEventListener("DOMContentLoaded", () => {
  const appRoot = document.getElementById("app");
  appRoot.innerHTML = DashboardPage();
  bindDashboardEvents();
});
