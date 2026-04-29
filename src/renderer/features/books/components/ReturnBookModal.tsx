import type { ReactElement } from "react";
import { RotateCcw, UserRound } from "lucide-react";
import { BookModalFrame } from "./BookModalFrame";
import { BookSummaryCard } from "./BookSummaryCard";
import type { BookRecord } from "../types";

type ReturnBookModalProps = {
  book: BookRecord;
  onClose: () => void;
  onSubmit: () => void;
};

export function ReturnBookModal({ book, onClose, onSubmit }: ReturnBookModalProps): ReactElement {
  const formId = "return-book-form";

  return (
    <BookModalFrame
      footer={(
        <>
          <button className="books-secondary-button" onClick={onClose} type="button">انصراف</button>
          <button className="books-primary-action" form={formId} type="submit">ثبت بازگردانی</button>
        </>
      )}
      icon={RotateCcw}
      onClose={onClose}
      title="بازگردانی کتاب"
    >
      <form
        className="book-modal-form book-modal-form--single"
        id={formId}
        onSubmit={(event) => { event.preventDefault(); onSubmit(); }}
      >
        <BookSummaryCard book={book} />
        <div className="loan-detail-grid">
          <span><UserRound size={16} />امانت‌گیرنده<b>{book.borrower ?? "سارا مجیدی"}</b></span>
          <span>تاریخ امانت<b>۱۴۰۴/۰۳/۱۲</b></span>
          <span>تاریخ بازگردانی<b>سال نگهداری</b></span>
          <span>تعداد نسخه<b>۱</b></span>
        </div>
        <label className="form-wide">تاریخ بازگشت *<input defaultValue="۱۴۰۴/۰۳/۱۵" /></label>
        <div className="condition-options">
          <span>وضعیت کتاب *</span>
          <button className="is-active" type="button">سالم</button>
          <button type="button">دارای آسیب</button>
        </div>
        <label className="form-wide">یادداشت<textarea placeholder="یادداشتی درباره وضعیت کتاب (اختیاری)..." /></label>
      </form>
    </BookModalFrame>
  );
}
