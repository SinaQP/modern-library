import type { FormEvent, ReactElement } from "react";
import { useState } from "react";
import { Pencil, Save, Trash2 } from "lucide-react";
import { BookModalFrame } from "./BookModalFrame";
import { FormGrid, bookFormUtils } from "./AddBookModal";
import type { BookFormValues, BookRecord } from "../types";

type EditBookModalProps = {
  book: BookRecord;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: BookFormValues) => Promise<void>;
};

export function EditBookModal({ book, isSubmitting, onClose, onSubmit }: EditBookModalProps): ReactElement {
  const formId = "edit-book-form";
  const [formError, setFormError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = bookFormUtils.readBookForm(event.currentTarget);
    const error = bookFormUtils.validateBookForm(values);
    setFormError(error);

    if (error) {
      return;
    }

    await onSubmit(values);
  }

  return (
    <BookModalFrame
      footer={(
        <>
          <button className="books-secondary-button" disabled={isSubmitting} onClick={onClose} type="button">انصراف</button>
          <button className="books-navy-action" disabled={isSubmitting} form={formId} type="submit">
            <Save size={20} />
            {isSubmitting ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </button>
        </>
      )}
      icon={Pencil}
      onClose={onClose}
      title="ویرایش کتاب"
    >
      <form className="book-form-layout" id={formId} onSubmit={handleSubmit}>
        <aside className="edit-cover-panel">
          <div className={`book-cover edit-cover-panel__cover ${book.coverClass}`}>
            <span>{book.title}</span>
            <small>{book.author}</small>
          </div>
          <button disabled type="button"><Pencil size={18} />تغییر تصویر</button>
          <button className="danger-lite" disabled type="button"><Trash2 size={18} />حذف تصویر</button>
        </aside>
        <div className="book-modal-form">
          {formError ? <p className="form-alert" role="alert">{formError}</p> : null}
          <FormGrid
            book={{
              title: book.title,
              author: book.author,
              category: book.category,
              publisher: book.publisher ?? "",
              publish_year: book.publishYear || null,
              description: book.description ?? ""
            }}
          />
        </div>
      </form>
    </BookModalFrame>
  );
}
