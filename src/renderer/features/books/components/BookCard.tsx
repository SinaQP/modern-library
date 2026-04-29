import type { ReactElement } from "react";
import { Bookmark, Info, MoreHorizontal, Pencil, RotateCcw, Trash2, UserPlus, UserRound } from "lucide-react";
import type { BookRecord } from "../types";

type BookCardProps = {
  book: BookRecord;
  onDelete: (bookId: string) => void;
  onEdit: (bookId: string) => void;
  onLoan: (bookId: string) => void;
  onReturn: (bookId: string) => void;
};

export function BookCard({ book, onDelete, onEdit, onLoan, onReturn }: BookCardProps): ReactElement {
  const isLoaned = book.status === "loaned";

  return (
    <article className="book-card">
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
        <button aria-label="ویرایش کتاب" onClick={() => onEdit(book.id)} type="button"><Pencil size={22} /></button>
        <button
          aria-label="حذف کتاب"
          className="book-card__action--danger"
          onClick={() => onDelete(book.id)}
          type="button"
        >
          <Trash2 size={22} />
        </button>
        {!isLoaned ? (
          <button aria-label="نشان کردن کتاب" type="button"><Bookmark size={22} /></button>
        ) : null}
        <button
          aria-label={isLoaned ? "بازگردانی کتاب" : "ثبت امانت کتاب"}
          onClick={() => (isLoaned ? onReturn(book.id) : onLoan(book.id))}
          type="button"
        >
          {isLoaned ? <RotateCcw size={22} /> : <UserPlus size={22} />}
        </button>
      </footer>
    </article>
  );
}
