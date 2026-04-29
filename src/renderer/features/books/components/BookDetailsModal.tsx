import type { ReactElement } from "react";
import { BookOpen, HandHeart, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { BookModalFrame } from "./BookModalFrame";
import type { BookRecord } from "../types";

type BookDetailsModalProps = {
  book: BookRecord;
  onClose: () => void;
  onDelete: (book: BookRecord) => void;
  onEdit: (book: BookRecord) => void;
  onLoan: (book: BookRecord) => void;
  onReturn: (book: BookRecord) => void;
};

const persianNumber = new Intl.NumberFormat("fa-IR");

function detailValue(value?: number | string): string {
  if (typeof value === "number") {
    return persianNumber.format(value);
  }

  return value?.trim() || "ثبت نشده";
}

function DetailItem({ label, value }: { label: string; value?: number | string }): ReactElement {
  return (
    <div className="book-details__item">
      <span>{label}</span>
      <strong>{detailValue(value)}</strong>
    </div>
  );
}

export function BookDetailsModal({
  book,
  onClose,
  onDelete,
  onEdit,
  onLoan,
  onReturn
}: BookDetailsModalProps): ReactElement {
  const isLoaned = book.status === "loaned";

  return (
    <BookModalFrame
      footer={(
        <div className="book-details__actions">
          <button className="books-secondary-button" onClick={onClose} type="button">بستن</button>
          <button className="books-navy-action" onClick={() => onEdit(book)} type="button">
            <Pencil size={20} aria-hidden="true" />
            ویرایش
          </button>
          <button
            className="books-primary-action"
            onClick={() => (isLoaned ? onReturn(book) : onLoan(book))}
            type="button"
          >
            {isLoaned ? <RotateCcw size={20} aria-hidden="true" /> : <HandHeart size={20} aria-hidden="true" />}
            {isLoaned ? "بازگردانی" : "ثبت امانت"}
          </button>
          <button className="books-danger-action" onClick={() => onDelete(book)} type="button">
            <Trash2 size={20} aria-hidden="true" />
            حذف
          </button>
        </div>
      )}
      icon={BookOpen}
      onClose={onClose}
      title="جزئیات کتاب"
    >
      <article className="book-details">
        <aside className="book-details__cover-panel">
          <div className={`book-cover book-details__cover ${book.coverClass}`}>
            <span>{book.title}</span>
            <small>{book.author}</small>
          </div>
        </aside>

        <div className="book-details__content">
          <header className="book-details__title">
            <h3>{book.title}</h3>
            <p>{book.author}</p>
            {book.translator ? <span>ترجمه: {book.translator}</span> : null}
          </header>

          <div className="book-details__grid">
            <DetailItem label="دسته‌بندی" value={book.category} />
            <DetailItem label="ناشر" value={book.publisher} />
            <DetailItem label="شابک" value={book.isbn} />
            <DetailItem label="سال انتشار" value={book.publishYear} />
            <DetailItem label="تعداد نسخه" value={book.copyCount ?? 1} />
            <div className="book-details__item">
              <span>وضعیت</span>
              <strong className={isLoaned ? "book-status book-status--loaned" : "book-status"}>
                {isLoaned ? "امانت داده شده" : "در دسترس"}
              </strong>
            </div>
          </div>

          {isLoaned ? (
            <section className="book-details__loan" aria-label="اطلاعات امانت">
              <DetailItem label="امانت‌گیرنده" value={book.borrower} />
              <DetailItem label="تاریخ امانت" value={book.loanDate} />
              <DetailItem label="موعد بازگشت" value={book.dueDate} />
            </section>
          ) : null}

          {book.description ? (
            <section className="book-details__description">
              <h4>توضیحات</h4>
              <p>{book.description}</p>
            </section>
          ) : null}
        </div>
      </article>
    </BookModalFrame>
  );
}
