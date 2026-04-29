import type { ReactElement } from "react";
import { BookListRow } from "./BookListRow";
import type { BookRecord } from "../types";

type BookListProps = {
  books: BookRecord[];
  onDelete: (book: BookRecord) => void;
  onEdit: (book: BookRecord) => void;
  onLoan: (book: BookRecord) => void;
  onOpenDetails: (book: BookRecord) => void;
  onReturn: (book: BookRecord) => void;
  onToggleSaved: (book: BookRecord) => void;
  savedBookIds: Set<string>;
};

export function BookList({
  books,
  onDelete,
  onEdit,
  onLoan,
  onOpenDetails,
  onReturn,
  onToggleSaved,
  savedBookIds
}: BookListProps): ReactElement {
  return (
    <section className="book-list" aria-label="فهرست کتاب‌ها">
      <div className="book-list__header" role="row">
        <span role="columnheader">کتاب</span>
        <span role="columnheader">دسته‌بندی</span>
        <span role="columnheader">شابک</span>
        <span role="columnheader">وضعیت</span>
        <span role="columnheader">امانت</span>
        <span role="columnheader">اقدام‌ها</span>
      </div>

      <div className="book-list__body">
        {books.map((book) => (
          <BookListRow
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
      </div>
    </section>
  );
}
