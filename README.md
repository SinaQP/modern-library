# سامانه مدیریت کتابخانه شخصی و ثبت امانت کتاب

اپلیکیشن دسکتاپ فارسی (RTL) برای مدیریت کتابخانه شخصی با استفاده از **Electron + SQLite + HTML/CSS/JavaScript**.

## امکانات اصلی

- افزودن کتاب جدید
- ویرایش اطلاعات کتاب
- حذف کتاب با تاییدیه
- جستجوی زنده بر اساس عنوان، نویسنده، دسته‌بندی، ناشر و سال
- فیلتر وضعیت کتاب‌ها (همه، موجود، امانت داده شده)
- ثبت امانت کتاب (نام امانت‌گیرنده + تاریخ امانت)
- بازگردانی کتاب و پاک‌سازی اطلاعات امانت
- داشبورد آماری:
  - مجموع کتاب‌ها
  - کتاب‌های موجود
  - کتاب‌های امانت داده شده

## تکنولوژی‌ها

- Electron
- SQLite (با `better-sqlite3`)
- HTML
- CSS
- Vanilla JavaScript

## ساختار پروژه

```text
modern-library/
├─ main.js
├─ preload.js
├─ package.json
├─ README.md
├─ database/
│  └─ db.js
├─ renderer/
│  ├─ index.html
│  ├─ app.js
│  └─ styles.css
└─ assets/
   ├─ icons/
   └─ fonts/
```

## اجرای پروژه

### پیش‌نیاز

- Node.js نسخه 18 یا بالاتر
- npm

### نصب و اجرا

```bash
npm install
npm start
```

## اسکریپت‌های مفید

```bash
npm run check
```

بررسی سریع سینتکس فایل‌های جاوااسکریپت.

```bash
npm run rebuild
```

در صورت بروز مشکل ماژول native مربوط به SQLite، این دستور ماژول را برای Electron بازسازی می‌کند.

## رفع خطاهای رایج نصب

اگر خطای زیر را دریافت کردید:

`Electron failed to install correctly`

دستورات زیر را اجرا کنید:

```bash
rm -rf node_modules/electron
npm install electron --save-dev
```

در PowerShell ویندوز:

```powershell
Remove-Item -LiteralPath node_modules/electron -Recurse -Force
npm install electron --save-dev
```

## نکات فنی

- دیتابیس SQLite به‌صورت خودکار در مسیر `userData` اپلیکیشن ذخیره می‌شود.
- ارتباط بین Renderer و Main فقط از طریق `preload` و `ipc` انجام می‌شود.
- دسترسی مستقیم Node.js در Renderer غیرفعال است (`nodeIntegration: false`).
- رابط کاربری کاملا فارسی و راست‌چین (RTL) طراحی شده است.
