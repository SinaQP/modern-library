import type {
  BookRecord as LibraryBookRecord,
  BorrowBookPayload,
  CreateBookPayload,
  UpdateBookPayload
} from "../../library/types";
import type { BookFormValues, BookRecord, LoanFormValues } from "../types";

const STATUS_BORROWED = "امانت داده شده";
const coverClasses = [
  "cover-meaning",
  "cover-candle",
  "cover-alchemist",
  "cover-love",
  "cover-pride",
  "cover-art",
  "cover-1984",
  "cover-atomic"
] as const;

function getApi() {
  if (!window.libraryAPI) {
    throw new Error("ارتباط با کتابخانه در دسترس نیست.");
  }

  return window.libraryAPI;
}

function toFriendlyError(error: unknown): Error {
  if (error instanceof Error && error.message) {
    return new Error(error.message);
  }

  return new Error("انجام عملیات ناموفق بود.");
}

function toBookRecord(book: LibraryBookRecord): BookRecord {
  const isLoaned = book.status === STATUS_BORROWED;

  return {
    id: book.id,
    title: book.title,
    author: book.author,
    category: book.category ?? "دسته‌بندی نشده",
    isbn: "ثبت نشده",
    publishYear: book.publish_year ?? 0,
    publisher: book.publisher ?? undefined,
    copyCount: 1,
    description: book.description ?? undefined,
    createdAt: new Date(book.id).toISOString(),
    status: isLoaned ? "loaned" : "available",
    borrower: book.borrower_name ?? undefined,
    loanDate: book.borrow_date ?? undefined,
    dueDate: book.borrow_date ?? undefined,
    coverClass: coverClasses[book.id % coverClasses.length]
  };
}

function compactBookPayload(values: BookFormValues): CreateBookPayload {
  return {
    title: values.title.trim(),
    author: values.author.trim(),
    category: values.category.trim(),
    publish_year: values.publish_year,
    publisher: values.publisher.trim(),
    description: values.description.trim()
  };
}

export async function fetchBooks(): Promise<BookRecord[]> {
  try {
    const books = await getApi().getBooks();
    return books.map(toBookRecord);
  } catch (error) {
    throw toFriendlyError(error);
  }
}

export async function addBook(values: BookFormValues): Promise<void> {
  try {
    await getApi().addBook(compactBookPayload(values));
  } catch (error) {
    throw toFriendlyError(error);
  }
}

export async function updateBook(id: number, values: BookFormValues): Promise<void> {
  try {
    const payload: UpdateBookPayload = {
      id,
      ...compactBookPayload(values)
    };
    await getApi().updateBook(payload);
  } catch (error) {
    throw toFriendlyError(error);
  }
}

export async function deleteBook(id: number): Promise<void> {
  try {
    await getApi().deleteBook(id);
  } catch (error) {
    throw toFriendlyError(error);
  }
}

export async function loanBook(id: number, values: LoanFormValues): Promise<void> {
  try {
    const payload: BorrowBookPayload = {
      id,
      borrower_name: values.borrower_name.trim(),
      borrow_date: values.borrow_date
    };
    await getApi().borrowBook(payload);
  } catch (error) {
    throw toFriendlyError(error);
  }
}

export async function returnBook(id: number): Promise<void> {
  try {
    await getApi().returnBook(id);
  } catch (error) {
    throw toFriendlyError(error);
  }
}
