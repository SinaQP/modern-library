import type { ReactElement } from "react";
import { AlertTriangle } from "lucide-react";
import { BookModalFrame } from "./BookModalFrame";
import type { BookRecord } from "../types";

type DeleteBookDialogProps = {
  book: BookRecord;
  onClose: () => void;
  onSubmit: () => void;
};

export function DeleteBookDialog({ book, onClose, onSubmit }: DeleteBookDialogProps): ReactElement {
  return (
    <BookModalFrame
      footer={(
        <>
          <button className="books-secondary-button" onClick={onClose} type="button">انصراف</button>
          <button className="books-danger-action" onClick={onSubmit} type="button">حذف کتاب</button>
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
