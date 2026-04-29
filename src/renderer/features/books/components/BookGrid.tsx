import type { ReactElement } from "react";
import { BookCard } from "./BookCard";
import type { BookRecord } from "../types";

type BookGridProps = {
  books: BookRecord[];
  onDelete: (book: BookRecord) => void;
  onEdit: (book: BookRecord) => void;
  onLoan: (book: BookRecord) => void;
  onOpenDetails: (book: BookRecord) => void;
  onReturn: (book: BookRecord) => void;
  onToggleSaved: (book: BookRecord) => void;
  savedBookIds: Set<string>;
};

export function BookGrid({
  books,
  onDelete,
  onEdit,
  onLoan,
  onOpenDetails,
  onReturn,
  onToggleSaved,
  savedBookIds
}: BookGridProps): ReactElement {
  return (
    <section className="book-grid" aria-label="فهرست کتاب‌ها">
      {books.map((book) => (
        <BookCard
          book={book}
          isSaved={savedBookIds.has(book.id)}
          key={book.id}
          onDelete={onDelete}
          onEdit={onEdit}
          onLoan={onLoan}
          onOpenDetails={onOpenDetails}
          onReturn={onReturn}
          onToggleSaved={onToggleSaved}
        />
      ))}
    </section>
  );
}
