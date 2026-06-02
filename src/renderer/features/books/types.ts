export type BookStatus = "available" | "loaned";

export type BookRecord = {
  author: string;
  borrower?: string;
  category: string;
  copyCount?: number;
  coverClass: string;
  createdAt: string;
  description?: string;
  dueDate?: string;
  id: number;
  isbn: string;
  loanDate?: string;
  publishYear: number;
  publisher?: string;
  status: BookStatus;
  title: string;
  translator?: string;
};

export type BookFilter = "available" | "loaned";

export type BookFormValues = {
  author: string;
  category: string;
  description: string;
  publish_year: number | null;
  publisher: string;
  title: string;
};

export type LoanFormValues = {
  borrow_date: string;
  borrower_name: string;
};

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

export type BookModalType = "add" | "details" | "edit" | "loan" | "return" | "delete";

export type BookViewMode = "grid" | "list";
