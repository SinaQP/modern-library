import type { ReactElement } from "react";
import { AlertTriangle } from "lucide-react";
import { BookModalFrame } from "./BookModalFrame";
import type { BookRecord } from "../types";

type DeleteBookDialogProps = {
  book: BookRecord;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void>;
};

export function DeleteBookDialog({ book, isSubmitting, onClose, onSubmit }: DeleteBookDialogProps): ReactElement {
  return (
    <BookModalFrame
      footer={(
        <>
          <button className="books-secondary-button" disabled={isSubmitting} onClick={onClose} type="button">انصراف</button>
          <button className="books-danger-action" disabled={isSubmitting} onClick={onSubmit} type="button">
            {isSubmitting ? "در حال حذف..." : "حذف کتاب"}
          </button>
        </>
      )}
      icon={AlertTriangle}
      onClose={onClose}
      title=""
      width="md"
    >
      <div className="delete-dialog">
        <span className="delete-dialog__icon"><AlertTriangle size={42} /></span>
        <h2>حذف کتاب</h2>
        <p>آیا از حذف کتاب «{book.title}» اطمینان دارید؟</p>
        <small>این عمل قابل بازگشت نیست.</small>
      </div>
    </BookModalFrame>
  );
}
