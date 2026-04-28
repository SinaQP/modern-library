import type { BookFilter, BookRecord } from "./types";

export const mockBooks: BookRecord[] = [
  {
    id: "book-1",
    title: "انسان در جستجوی معنا",
    author: "ویکتور فرانکل",
    category: "روانشناسی",
    isbn: "978-622-7369-12-6",
    status: "available",
    coverClass: "cover-meaning"
  },
  {
    id: "book-2",
    title: "شمعی در باد",
    author: "فاطمه معتمدآریا",
    category: "داستان فارسی",
    isbn: "978-622-01-1234-7",
    status: "loaned",
    borrower: "سارا مجیدی",
    dueDate: "۱۴۰۴/۰۳/۱۷",
    coverClass: "cover-candle"
  },
  {
    id: "book-3",
    title: "کیمیاگر",
    author: "پائولو کوئیلو",
    category: "داستان خارجی",
    isbn: "978-964-369-422-6",
    status: "available",
    coverClass: "cover-alchemist"
  },
  {
    id: "book-4",
    title: "تسلیم نشو",
    author: "هاروکی موراکامی",
    category: "داستان خارجی",
    isbn: "978-600-353-260-1",
    status: "loaned",
    borrower: "امانت‌گیرنده",
    dueDate: "۱۴۰۴/۰۳/۰۵",
    coverClass: "cover-love"
  },
  {
    id: "book-5",
    title: "غرور و تعصب",
    author: "جین آستین",
    category: "رمان کلاسیک",
    isbn: "978-600-8671-90-3",
    status: "available",
    coverClass: "cover-pride"
  },
  {
    id: "book-6",
    title: "حکمت هنر",
    author: "آلن دوباتن",
    category: "فلسفه",
    isbn: "978-622-06-1256-2",
    status: "available",
    coverClass: "cover-art"
  },
  {
    id: "book-7",
    title: "1984",
    author: "جورج اورول",
    category: "ادبیات کلاسیک",
    isbn: "978-964-311-678-2",
    status: "loaned",
    borrower: "نیما قاسمی",
    dueDate: "۱۴۰۴/۰۳/۲۰",
    coverClass: "cover-1984"
  },
  {
    id: "book-8",
    title: "قدرت عادت",
    author: "چارلز دوهیگ",
    category: "روانشناسی",
    isbn: "978-600-118-987-0",
    status: "available",
    coverClass: "cover-atomic"
  }
];

export const initialSelectedBookIds = new Set(["book-2", "book-4", "book-6"]);

export const noResultsFilters = new Set<BookFilter>(["available", "loaned"]);
