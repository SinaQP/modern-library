import type { ReactElement } from "react";
import { Bookmark, Info, MoreHorizontal, Pencil, RotateCcw, UserRound } from "lucide-react";
import type { BookRecord } from "../types";

type BookCardProps = {
  book: BookRecord;
  isSelected: boolean;
  onToggleSelection: (bookId: string) => void;
};

export function BookCard({ book, isSelected, onToggleSelection }: BookCardProps): ReactElement {
  const isLoaned = book.status === "loaned";

  return (
    <article className={isSelected ? "book-card is-selected" : "book-card"}>
      <label className="book-card__checkbox">
        <input
          checked={isSelected}
          onChange={() => onToggleSelection(book.id)}
          type="checkbox"
        />
        <span aria-hidden="true" />
      </label>

      <div className={`book-cover book-card__cover ${book.coverClass}`}>
        <span>{book.title}</span>
        <small>{book.author}</small>
      </div>

      <div className="book-card__body">
        <h2>{book.title}</h2>
        <p>{book.author}</p>
        <span>{book.category}</span>
        <small>ISBN: {book.isbn}</small>
        <strong className={isLoaned ? "book-status book-status--loaned" : "book-status"}>
          {isLoaned ? "امانت داده شده" : "در دسترس"}
        </strong>

        {isLoaned ? (
          <div className="book-loan-info">
            <span><UserRound size={16} aria-hidden="true" />{book.borrower ?? "امانت‌گیرنده"}</span>
            <p>موعد بازگشت: <b>{book.dueDate}</b></p>
          </div>
        ) : null}
      </div>

      <footer className="book-card__footer">
        <button aria-label="گزینه‌های بیشتر" type="button"><MoreHorizontal size={22} /></button>
        <button aria-label="اطلاعات کتاب" type="button"><Info size={22} /></button>
        <button aria-label="ویرایش کتاب" type="button"><Pencil size={22} /></button>
        <button aria-label={isLoaned ? "بازگردانی کتاب" : "نشان کردن کتاب"} type="button">
          {isLoaned ? <RotateCcw size={22} /> : <Bookmark size={22} />}
        </button>
      </footer>
    </article>
  );
}
