# سامانه مدیریت کتابخانه شخصی

اپلیکیشن دسکتاپ فارسی و راست‌چین برای مدیریت کتابخانه شخصی با **Electron + React + TypeScript + Vite + SQLite**.

## امکانات نسخه اول

- نمایش فهرست کتاب‌ها از دیتابیس SQLite
- افزودن کتاب جدید
- ویرایش اطلاعات کتاب
- حذف کتاب با تایید کاربر
- جستجو در عنوان، نویسنده، دسته‌بندی، ناشر و شناسه نمایشی
- فیلتر وضعیت کتاب‌ها: همه، در دسترس، امانت داده شده
- مرتب‌سازی فهرست بر اساس عنوان، نویسنده، سال انتشار، وضعیت و جدیدترین/قدیمی‌ترین
- ثبت امانت کتاب با نام امانت‌گیرنده و تاریخ امانت
- بازگردانی کتاب و پاک شدن اطلاعات امانت
- نمایش حالت‌های بارگذاری، خطا، بدون کتاب و بدون نتیجه

## تکنولوژی‌ها

- Electron
- React
- TypeScript
- Vite
- SQLite با `better-sqlite3`
- `lucide-react` برای آیکن‌ها

## ساختار اصلی پروژه

```text
modern-library/
├─ main.js                  # فرایند اصلی Electron
├─ preload.js               # API امن renderer
├─ database/
│  └─ db.js                 # ذخیره‌سازی SQLite و قوانین دامنه کتاب
├─ ipc/
│  └─ book-handlers.js      # handlerهای IPC کتاب
├─ shared/
│  ├─ errors.js
│  └─ ipc/channels.js
├─ src/renderer/            # renderer جدید React + TypeScript
│  ├─ app/
│  ├─ components/
│  ├─ features/
│  └─ styles/
├─ renderer/                # fallback قدیمی، برای توسعه جدید استفاده نشود
└─ renderer-dist/           # خروجی build renderer
```

## اجرا

### پیش‌نیازها

- Node.js نسخه 18 یا بالاتر
- npm

### نصب

```bash
npm install
```

### اجرای برنامه

```bash
npm start
```

این دستور renderer را با Vite build می‌کند و سپس Electron را اجرا می‌کند.

## دستورهای مفید

```bash
npm run check
```

syntax فایل‌های JavaScript اصلی و TypeScript renderer را بررسی می‌کند.

```bash
npm run typecheck
```

فقط بررسی TypeScript را اجرا می‌کند.

```bash
npm run build
```

renderer را برای production می‌سازد.

```bash
npm run dist
```

نسخه نصب‌شونده Windows را با `electron-builder` می‌سازد. این دستور ممکن است برای دانلود Electron به اینترنت نیاز داشته باشد.

```bash
npm run rebuild
```

ماژول native مربوط به SQLite را برای Electron بازسازی می‌کند.

## نکات فنی

- دیتابیس SQLite به صورت خودکار در مسیر `userData` اپلیکیشن ذخیره می‌شود.
- renderer به Node.js یا filesystem دسترسی مستقیم ندارد.
- ارتباط renderer با Electron فقط از طریق `window.libraryAPI` در `preload.js` انجام می‌شود.
- تنظیمات امنیتی پنجره شامل `contextIsolation: true`، `nodeIntegration: false`، `sandbox: true` و `webSecurity: true` است.
- مسیر فعال نسخه اول روی مدیریت کتاب‌ها متمرکز است؛ بخش‌های وام‌گیرندگان، تنظیمات و داشبورد جداگانه هنوز وارد scope نسخه اول نشده‌اند.
