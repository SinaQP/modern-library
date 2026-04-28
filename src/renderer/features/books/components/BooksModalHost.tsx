import type { ReactElement } from "react";
import { AddBookModal } from "./AddBookModal";
import { DeleteBookDialog } from "./DeleteBookDialog";
import { EditBookModal } from "./EditBookModal";
import { LoanBookModal } from "./LoanBookModal";
import { ReturnBookModal } from "./ReturnBookModal";
import type { BookModalType, BookRecord, ToastVariant } from "../types";

type BooksModalHostProps = {
  activeModal: BookModalType | null;
  book?: BookRecord;
  onClose: () => void;
  onSubmit: (variant?: ToastVariant) => void;
};

export function BooksModalHost({
  activeModal,
  book,
  onClose,
  onSubmit
}: BooksModalHostProps): ReactElement | null {
  if (!activeModal) {
    return null;
  }

  if (activeModal === "add") {
    return <AddBookModal onClose={onClose} onSubmit={() => onSubmit("success")} />;
  }

  if (!book) {
    return null;
  }

  if (activeModal === "edit") {
    return <EditBookModal book={book} onClose={onClose} onSubmit={() => onSubmit("success")} />;
  }

  if (activeModal === "loan") {
    return <LoanBookModal book={book} onClose={onClose} onSubmit={() => onSubmit("error")} />;
  }

  if (activeModal === "return") {
    return <ReturnBookModal book={book} onClose={onClose} onSubmit={() => onSubmit("info")} />;
  }

  return <DeleteBookDialog book={book} onClose={onClose} onSubmit={() => onSubmit("success")} />;
}
