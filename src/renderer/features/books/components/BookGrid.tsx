import type { ReactElement } from "react";
import { BookCard } from "./BookCard";
import type { BookRecord } from "../types";

type BookGridProps = {
  books: BookRecord[];
  onDelete: (bookId: string) => void;
  onEdit: (bookId: string) => void;
  onLoan: (bookId: string) => void;
  onReturn: (bookId: string) => void;
};

export function BookGrid({ books, onDelete, onEdit, onLoan, onReturn }: BookGridProps): ReactElement {
  return (
    <section className="book-grid" aria-label="فهرست کتاب‌ها">
      {books.map((book) => (
        <BookCard
          book={book}
          key={book.id}
          onDelete={onDelete}
          onEdit={onEdit}
          onLoan={onLoan}
          onReturn={onReturn}
        />
      ))}
    </section>
  );
}
