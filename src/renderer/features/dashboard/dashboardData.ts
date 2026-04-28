import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Clock3,
  Grid2X2,
  Lightbulb,
  PenLine,
  PlusCircle,
  PlusSquare,
  Repeat2,
  Search,
  Settings,
  UserPlus,
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

export type EmptyStateConfig = {
  actionIcon: LucideIcon;
  actionLabel: string;
  heading: string;
  icon: LucideIcon;
  pill: string;
  text: string;
  title: string;
};

export type GuideStep = {
  description: string;
  title: string;
};

export const sidebarItems: SidebarItem[] = [
  { label: "داشبورد", icon: Grid2X2, isActive: true },
  { label: "کتاب‌ها", icon: BookOpen, isActive: false },
  { label: "امانت‌ها", icon: Repeat2, isActive: false },
  { label: "امانت‌گیرندگان", icon: UsersRound, isActive: false },
  { label: "تنظیمات", icon: Settings, isActive: false }
];

export const populatedBooks = [
  { title: "پست شبانه عادت" },
  { title: "انسان در جستجوی معنا" },
  { title: "ملت عشق" },
  { title: "سقوط" },
  { title: "بادبادک‌باز" }
];

export const populatedStats: StatItem[] = [
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

export const emptyStats: StatItem[] = [
  {
    title: "کل کتاب‌ها",
    value: "۰",
    subtitle: "هنوز کتابی ثبت نشده است",
    icon: BookOpen,
    tone: "blue"
  },
  {
    title: "کتاب‌های موجود",
    value: "۰",
    subtitle: "هنوز کتابی ثبت نشده است",
    icon: CheckCircle2,
    tone: "green"
  },
  {
    title: "امانت‌های فعال",
    value: "۰",
    subtitle: "هنوز امانتی ثبت نشده است",
    icon: UserRound,
    tone: "orange"
  },
  {
    title: "کتاب‌های دیرکرد",
    value: "۰",
    subtitle: "هنوز موردی وجود ندارد",
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

export const emptyStateCards: EmptyStateConfig[] = [
  {
    title: "کتاب‌های اخیر",
    pill: "هیچ موردی وجود ندارد",
    icon: BookOpen,
    heading: "هنوز کتابی اضافه نکرده‌اید",
    text: "بعد از افزودن کتاب‌ها، آخرین موارد در اینجا نمایش داده می‌شود.",
    actionLabel: "افزودن اولین کتاب",
    actionIcon: PlusCircle
  },
  {
    title: "فعالیت‌های اخیر",
    pill: "هیچ فعالیتی وجود ندارد",
    icon: Clock3,
    heading: "هنوز فعالیتی ثبت نشده است",
    text: "بعد از ثبت امانت‌ها و عملیات، فعالیت‌های اخیر در اینجا نمایش داده می‌شود.",
    actionLabel: "ثبت اولین امانت",
    actionIcon: UserPlus
  }
];

export const gettingStartedSteps: GuideStep[] = [
  {
    title: "افزودن اولین کتاب",
    description: "اطلاعات کتاب‌ها را ثبت کنید."
  },
  {
    title: "ثبت امانت‌گیرندگان",
    description: "اطلاعات افراد امانت‌گیرنده را اضافه کنید."
  },
  {
    title: "ثبت اولین امانت",
    description: "کتابی را به امانت دهید و مدیریت را شروع کنید."
  }
];

export const guideHintIcon = Lightbulb;
