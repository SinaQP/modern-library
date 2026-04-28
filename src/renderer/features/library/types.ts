export const BOOK_STATUS = {
  ALL: "همه",
  AVAILABLE: "موجود",
  BORROWED: "امانت داده شده"
} as const;

export type BookStatus = (typeof BOOK_STATUS)[keyof typeof BOOK_STATUS];

export type BookRecord = {
  id: number;
  title: string;
  author: string;
  category: string | null;
  publish_year: number | null;
  publisher: string | null;
  description: string | null;
  status: BookStatus | string;
  borrower_name: string | null;
  borrow_date: string | null;
};

export type LibrarySummary = {
  total_books: number;
  available_books: number;
  borrowed_books: number;
};

export type BookFilters = {
  search?: string;
  status?: BookStatus | string;
};

export type CreateBookPayload = {
  title: string;
  author: string;
  category?: string;
  publish_year?: number | null;
  publisher?: string;
  description?: string;
};

export type UpdateBookPayload = CreateBookPayload & {
  id: number;
};

export type BorrowBookPayload = {
  id: number;
  borrower_name: string;
  borrow_date: string;
};

export type BookMutationResult = {
  id?: number;
  updated?: boolean;
  borrowed?: boolean;
  returned?: boolean;
};

export type LibraryDashboardData = {
  books: BookRecord[];
  summary: LibrarySummary;
};

export type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };
