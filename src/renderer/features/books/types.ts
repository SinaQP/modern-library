export type BookStatus = "available" | "loaned";

export type BookRecord = {
  author: string;
  borrower?: string;
  category: string;
  coverClass: string;
  createdAt: string;
  dueDate?: string;
  id: string;
  isbn: string;
  publishYear: number;
  status: BookStatus;
  title: string;
};

export type BookFilter = "available" | "loaned" | "overdue";

export type BookSortOption =
  | "newest"
  | "oldest"
  | "title-asc"
  | "title-desc"
  | "author-asc"
  | "author-desc"
  | "publish-year-desc"
  | "publish-year-asc"
  | "status-available-first"
  | "status-loaned-first";

export type ToastVariant = "success" | "error" | "info";

export type ToastMessage = {
  id: number;
  text: string;
  title: string;
  variant: ToastVariant;
};

export type BookModalType = "add" | "edit" | "loan" | "return" | "delete";
