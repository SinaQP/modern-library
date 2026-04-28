import type { ReactElement } from "react";
import type { BookRecord } from "../types";

type BookSummaryCardProps = {
  book: BookRecord;
};

export function BookSummaryCard({ book }: BookSummaryCardProps): ReactElement {
  return (
    <article className="book-summary-card">
      <div className={`book-cover book-summary-card__cover ${book.coverClass}`}>
        <span>{book.title}</span>
        <small>{book.author}</small>
      </div>
      <div>
        <h3>{book.title}</h3>
        <p>{book.author}</p>
        <span>{book.category}</span>
        <small>ISBN: {book.isbn}</small>
      </div>
    </article>
  );
}
