import type { ReactElement } from "react";
import { RotateCcw, UserRound } from "lucide-react";
import { BookModalFrame } from "./BookModalFrame";
import { BookSummaryCard } from "./BookSummaryCard";
import type { BookRecord } from "../types";

type ReturnBookModalProps = {
  book: BookRecord;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void>;
};

export function ReturnBookModal({ book, isSubmitting, onClose, onSubmit }: ReturnBookModalProps): ReactElement {
  return (
    <BookModalFrame
      footer={(
        <>
          <button className="books-secondary-button" disabled={isSubmitting} onClick={onClose} type="button">انصراف</button>
          <button className="books-primary-action" disabled={isSubmitting} onClick={onSubmit} type="button">
            {isSubmitting ? "در حال ثبت..." : "ثبت بازگردانی"}
          </button>
        </>
      )}
      icon={RotateCcw}
      onClose={onClose}
      title="بازگردانی کتاب"
    >
      <div className="book-modal-form book-modal-form--single">
        <BookSummaryCard book={book} />
        <div className="loan-detail-grid">
          <span><UserRound size={16} />امانت‌گیرنده<b>{book.borrower ?? "ثبت نشده"}</b></span>
          <span>تاریخ امانت<b>{book.loanDate ?? "ثبت نشده"}</b></span>
        </div>
      </div>
    </BookModalFrame>
  );
}
