/// <reference types="vite/client" />

import type {
  BookFilters,
  BookMutationResult,
  BookRecord,
  BorrowBookPayload,
  CreateBookPayload,
  LibrarySummary,
  UpdateBookPayload
} from "./features/library/types";

export {};

type LibraryApi = {
  getBooks: (filters?: BookFilters) => Promise<BookRecord[]>;
  getSummary: () => Promise<LibrarySummary>;
  addBook: (payload: CreateBookPayload) => Promise<BookMutationResult>;
  updateBook: (payload: UpdateBookPayload) => Promise<BookMutationResult>;
  deleteBook: (id: number) => Promise<{ deleted: boolean }>;
  borrowBook: (payload: BorrowBookPayload) => Promise<BookMutationResult>;
  returnBook: (id: number) => Promise<BookMutationResult>;
};

declare global {
  interface Window {
    libraryAPI?: LibraryApi;
  }
}
