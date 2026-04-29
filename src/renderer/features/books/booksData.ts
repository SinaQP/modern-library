import type { BookFilter, BookRecord } from "./types";

export const mockBooks: BookRecord[] = [
  {
    id: "book-1",
    title: "انسان در جستجوی معنا",
    author: "ویکتور فرانکل",
    category: "روانشناسی",
    isbn: "978-622-7369-12-6",
    publishYear: 1946,
    createdAt: "2026-04-24T10:00:00.000Z",
    status: "available",
    coverClass: "cover-meaning"
  },
  {
    id: "book-2",
    title: "شمعی در باد",
    author: "فاطمه معتمدآریا",
    category: "داستان فارسی",
    isbn: "978-622-01-1234-7",
    publishYear: 2019,
    createdAt: "2026-04-22T09:30:00.000Z",
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
    publishYear: 1988,
    createdAt: "2026-04-20T14:20:00.000Z",
    status: "available",
    coverClass: "cover-alchemist"
  },
  {
    id: "book-4",
    title: "تسلیم نشو",
    author: "هاروکی موراکامی",
    category: "داستان خارجی",
    isbn: "978-600-353-260-1",
    publishYear: 2021,
    createdAt: "2026-04-18T08:45:00.000Z",
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
    publishYear: 1813,
    createdAt: "2026-04-16T12:10:00.000Z",
    status: "available",
    coverClass: "cover-pride"
  },
  {
    id: "book-6",
    title: "حکمت هنر",
    author: "آلن دوباتن",
    category: "فلسفه",
    isbn: "978-622-06-1256-2",
    publishYear: 2006,
    createdAt: "2026-04-14T16:00:00.000Z",
    status: "available",
    coverClass: "cover-art"
  },
  {
    id: "book-7",
    title: "1984",
    author: "جورج اورول",
    category: "ادبیات کلاسیک",
    isbn: "978-964-311-678-2",
    publishYear: 1949,
    createdAt: "2026-04-12T11:15:00.000Z",
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
    publishYear: 2012,
    createdAt: "2026-04-10T13:40:00.000Z",
    status: "available",
    coverClass: "cover-atomic"
  }
];

export const noResultsFilters = new Set<BookFilter>(["available", "loaned"]);
