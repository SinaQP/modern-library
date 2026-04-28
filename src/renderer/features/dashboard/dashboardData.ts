import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Clock3,
  Grid2X2,
  PenLine,
  PlusCircle,
  PlusSquare,
  Repeat2,
  Search,
  Settings,
  UserRound,
  UsersRound
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type SidebarItem = {
  icon: LucideIcon;
  isActive: boolean;
  label: string;
};

export type StatItem = {
  detail?: string;
  icon: LucideIcon;
  subtitle: string;
  title: string;
  tone: "blue" | "green" | "orange" | "red";
  unit?: string;
  value: string;
};

export type QuickAction = {
  icon: LucideIcon;
  label: string;
};

export type DueBook = {
  author: string;
  borrower: string;
  coverClass: string;
  dueDate: string;
  title: string;
};

export type NewBook = {
  author: string;
  coverClass: string;
  date: string;
  title: string;
};

export type RecentActivity = {
  icon: LucideIcon;
  text: string;
  time: string;
  tone: "blue" | "green" | "orange";
};

export const sidebarItems: SidebarItem[] = [
  { label: "داشبورد", icon: Grid2X2, isActive: true },
  { label: "کتاب‌ها", icon: BookOpen, isActive: false },
  { label: "امانت‌ها", icon: Repeat2, isActive: false },
  { label: "امانت‌گیرندگان", icon: UsersRound, isActive: false },
  { label: "تنظیمات", icon: Settings, isActive: false }
];

export const stats: StatItem[] = [
  {
    title: "کل کتاب‌ها",
    value: "۵۴۸",
    unit: "کتاب",
    subtitle: "در کتابخانه شخصی شما",
    icon: BookOpen,
    tone: "blue"
  },
  {
    title: "کتاب‌های موجود",
    value: "۳۲۴",
    unit: "کتاب",
    subtitle: "از مجموع کتاب‌ها",
    icon: CheckCircle2,
    tone: "green"
  },
  {
    title: "امانت‌های فعال",
    value: "۱۲",
    unit: "کتاب",
    subtitle: "به ۶ نفر امانت داده شده",
    icon: UserRound,
    tone: "orange"
  },
  {
    title: "کتاب‌های دیرکرد",
    value: "۷",
    unit: "کتاب",
    subtitle: "",
    detail: "۳ امانت دیرکرد",
    icon: AlertTriangle,
    tone: "red"
  }
];

export const quickActions: QuickAction[] = [
  { label: "افزودن کتاب", icon: PlusSquare },
  { label: "ثبت امانت", icon: Repeat2 },
  { label: "جستجوی کتاب", icon: Search },
  { label: "امانت‌گیرندگان", icon: UsersRound }
];

export const dueBooks: DueBook[] = [
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
    coverClass: "cover-meaning"
  },
  {
    title: "ملت عشق",
    author: "الیف شافاک",
    borrower: "امیرحسین رضایی",
    dueDate: "۱۴۰۴/۰۲/۲۳",
    coverClass: "cover-love"
  }
];

export const newBooks: NewBook[] = [
  { title: "سقوط", author: "آلبر کامو", date: "۱۴۰۴/۰۳/۲۱", coverClass: "cover-fall" },
  { title: "بادبادک‌باز", author: "خالد حسینی", date: "۱۴۰۴/۰۳/۱۹", coverClass: "cover-kite" },
  { title: "جزیره", author: "آلدووس هاکسلی", date: "۱۴۰۴/۰۲/۱۸", coverClass: "cover-island" },
  { title: "شازده کوچولو", author: "آنتوان دوست...", date: "۱۴۰۴/۰۲/۱۶", coverClass: "cover-prince" },
  { title: "خرده عادت‌ها", author: "جیمز کلیر", date: "۱۴۰۴/۰۱/۱۵", coverClass: "cover-atomic" }
];

export const recentActivities: RecentActivity[] = [
  { text: "امانت «ملت عشق» به امیرحسین رضایی", time: "امروز، ۱۰:۲۴", icon: UserRound, tone: "orange" },
  { text: "بازگشت «گرگ و میش» توسط نرگس موسوی", time: "دیروز، ۱۸:۴۲", icon: CheckCircle2, tone: "green" },
  { text: "افزودن کتاب جدید «بادبادک‌باز»", time: "دیروز، ۱۶:۱۰", icon: PlusCircle, tone: "blue" },
  { text: "امانت «انسان در جستجوی معنا» به سارا محمدی", time: "۱۴۰۴/۰۲/۳۰، ۱۲:۳۵", icon: UserRound, tone: "orange" },
  { text: "ویرایش اطلاعات کتاب «شازده کوچولو»", time: "۱۴۰۴/۰۲/۲۹، ۰۹:۱۸", icon: PenLine, tone: "blue" }
];

export const activityButtonIcon = Clock3;
