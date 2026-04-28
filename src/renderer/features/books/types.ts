export type BookStatus = "available" | "loaned";

export type BookRecord = {
  author: string;
  borrower?: string;
  category: string;
  coverClass: string;
  dueDate?: string;
  id: string;
  isbn: string;
  status: BookStatus;
  title: string;
};

export type BookFilter = "available" | "loaned" | "overdue";

export type ToastVariant = "success" | "error" | "info";

export type ToastMessage = {
  id: number;
  text: string;
  title: string;
  variant: ToastVariant;
};

export type BookModalType = "add" | "edit" | "loan" | "return" | "delete";
