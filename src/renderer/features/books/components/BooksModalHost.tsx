import type { ReactElement } from "react";
import { AddBookModal } from "./AddBookModal";
import { DeleteBookDialog } from "./DeleteBookDialog";
import { BookDetailsModal } from "./BookDetailsModal";
import { EditBookModal } from "./EditBookModal";
import { LoanBookModal } from "./LoanBookModal";
import { ReturnBookModal } from "./ReturnBookModal";
import type { BookFormValues, BookModalType, BookRecord, LoanFormValues } from "../types";

type BooksModalHostProps = {
  activeModal: BookModalType | null;
  book?: BookRecord;
  isSubmitting: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>;
  onOpenBookModal: (modal: Exclude<BookModalType, "add">, bookId: number) => void;
  onSubmitAdd: (values: BookFormValues) => Promise<void>;
  onSubmitEdit: (values: BookFormValues) => Promise<void>;
  onSubmitLoan: (values: LoanFormValues) => Promise<void>;
  onSubmitReturn: () => Promise<void>;
};

export function BooksModalHost({
  activeModal,
  book,
  isSubmitting,
  onClose,
  onDelete,
  onOpenBookModal,
  onSubmitAdd,
  onSubmitEdit,
  onSubmitLoan,
  onSubmitReturn
}: BooksModalHostProps): ReactElement | null {
  if (!activeModal) {
    return null;
  }

  if (activeModal === "add") {
    return <AddBookModal isSubmitting={isSubmitting} onClose={onClose} onSubmit={onSubmitAdd} />;
  }

  if (!book) {
    return null;
  }

  if (activeModal === "details") {
    return (
      <BookDetailsModal
        book={book}
        onClose={onClose}
        onDelete={(selectedBook) => onOpenBookModal("delete", selectedBook.id)}
        onEdit={(selectedBook) => onOpenBookModal("edit", selectedBook.id)}
        onLoan={(selectedBook) => onOpenBookModal("loan", selectedBook.id)}
        onReturn={(selectedBook) => onOpenBookModal("return", selectedBook.id)}
      />
    );
  }

  if (activeModal === "edit") {
    return <EditBookModal book={book} isSubmitting={isSubmitting} onClose={onClose} onSubmit={onSubmitEdit} />;
  }

  if (activeModal === "loan") {
    return <LoanBookModal book={book} isSubmitting={isSubmitting} onClose={onClose} onSubmit={onSubmitLoan} />;
  }

  if (activeModal === "return") {
    return <ReturnBookModal book={book} isSubmitting={isSubmitting} onClose={onClose} onSubmit={onSubmitReturn} />;
  }

  return <DeleteBookDialog book={book} isSubmitting={isSubmitting} onClose={onClose} onSubmit={onDelete} />;
}
