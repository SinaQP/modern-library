import type { ReactElement } from "react";
import { BookCard } from "./BookCard";
import type { BookRecord } from "../types";

type BookGridProps = {
  books: BookRecord[];
  onToggleSelection: (bookId: string) => void;
  selectedBookIds: Set<string>;
};

export function BookGrid({ books, onToggleSelection, selectedBookIds }: BookGridProps): ReactElement {
  return (
    <section className="book-grid" aria-label="فهرست کتاب‌ها">
      {books.map((book) => (
        <BookCard
          book={book}
          isSelected={selectedBookIds.has(book.id)}
          key={book.id}
          onToggleSelection={onToggleSelection}
        />
      ))}
    </section>
  );
}
