import type { FormEvent, ReactElement } from "react";
import { useState } from "react";
import { BookPlus, Image, Plus } from "lucide-react";
import { BookModalFrame } from "./BookModalFrame";
import type { BookFormValues } from "../types";

type AddBookModalProps = {
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: BookFormValues) => Promise<void>;
};

function readBookForm(form: HTMLFormElement): BookFormValues {
  const formData = new FormData(form);
  const publishYearValue = String(formData.get("publish_year") ?? "").trim();

  return {
    title: String(formData.get("title") ?? "").trim(),
    author: String(formData.get("author") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    publisher: String(formData.get("publisher") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    publish_year: publishYearValue ? Number(publishYearValue) : null
  };
}

function validateBookForm(values: BookFormValues): string {
  if (!values.title) {
    return "عنوان کتاب الزامی است.";
  }

  if (!values.author) {
    return "نام نویسنده الزامی است.";
  }

  if (
    values.publish_year !== null &&
    (!Number.isInteger(values.publish_year) || values.publish_year < 1000 || values.publish_year > 2100)
  ) {
    return "سال انتشار باید عددی بین 1000 تا 2100 باشد.";
  }

  return "";
}

export function AddBookModal({ isSubmitting, onClose, onSubmit }: AddBookModalProps): ReactElement {
  const formId = "add-book-form";
  const [formError, setFormError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = readBookForm(event.currentTarget);
    const error = validateBookForm(values);
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
          <button className="books-primary-action" disabled={isSubmitting} form={formId} type="submit">
            <Plus size={20} />
            {isSubmitting ? "در حال ثبت..." : "افزودن کتاب"}
          </button>
        </>
      )}
      icon={BookPlus}
      onClose={onClose}
      title="افزودن کتاب"
    >
      <form className="book-form-layout" id={formId} onSubmit={handleSubmit}>
        <aside className="cover-upload-box">
          <Image size={42} aria-hidden="true" />
          <strong>تصویر جلد کتاب</strong>
          <span>در نسخه اول جلدها به صورت خودکار نمایش داده می‌شوند.</span>
        </aside>
        <div className="book-modal-form">
          {formError ? <p className="form-alert" role="alert">{formError}</p> : null}
          <FormGrid />
        </div>
      </form>
    </BookModalFrame>
  );
}

export function FormGrid({ book }: { book?: Partial<BookFormValues> }): ReactElement {
  return (
    <>
      <label>عنوان کتاب *<input name="title" defaultValue={book?.title ?? ""} placeholder="مثلا: شمعی در باد" /></label>
      <label>نویسنده *<input name="author" defaultValue={book?.author ?? ""} placeholder="مثلا: فاطمه معتمدآریا" /></label>
      <label>دسته‌بندی<input name="category" defaultValue={book?.category ?? ""} placeholder="مثلا: داستان فارسی" /></label>
      <label>ناشر<input name="publisher" defaultValue={book?.publisher ?? ""} placeholder="مثلا: نشر نیلوفر" /></label>
      <label>سال انتشار<input inputMode="numeric" name="publish_year" defaultValue={book?.publish_year ?? ""} placeholder="مثلا: 1403" /></label>
      <label className="form-wide">توضیحات<textarea name="description" defaultValue={book?.description ?? ""} placeholder="توضیحی درباره کتاب بنویسید..." /></label>
    </>
  );
}

export const bookFormUtils = {
  readBookForm,
  validateBookForm
};
