import type { FormEvent, ReactElement } from "react";
import { useState } from "react";
import { HandHeart } from "lucide-react";
import { BookModalFrame } from "./BookModalFrame";
import { BookSummaryCard } from "./BookSummaryCard";
import type { BookRecord, LoanFormValues } from "../types";

type LoanBookModalProps = {
  book: BookRecord;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: LoanFormValues) => Promise<void>;
};

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function LoanBookModal({ book, isSubmitting, onClose, onSubmit }: LoanBookModalProps): ReactElement {
  const formId = "loan-book-form";
  const [formError, setFormError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = {
      borrower_name: String(formData.get("borrower_name") ?? "").trim(),
      borrow_date: String(formData.get("borrow_date") ?? "").trim()
    };

    if (!values.borrower_name || values.borrower_name.length < 3) {
      setFormError("نام امانت‌گیرنده باید حداقل 3 کاراکتر باشد.");
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(values.borrow_date)) {
      setFormError("تاریخ امانت باید با فرمت YYYY-MM-DD ثبت شود.");
      return;
    }

    setFormError("");
    await onSubmit(values);
  }

  return (
    <BookModalFrame
      footer={(
        <>
          <button className="books-secondary-button" disabled={isSubmitting} onClick={onClose} type="button">انصراف</button>
          <button className="books-primary-action" disabled={isSubmitting} form={formId} type="submit">
            {isSubmitting ? "در حال ثبت..." : "ثبت امانت"}
          </button>
        </>
      )}
      icon={HandHeart}
      onClose={onClose}
      title="ثبت امانت"
    >
      <form className="book-modal-form book-modal-form--single" id={formId} onSubmit={handleSubmit}>
        <BookSummaryCard book={book} />
        {formError ? <p className="form-alert" role="alert">{formError}</p> : null}
        <label className="form-wide">امانت‌گیرنده *<input name="borrower_name" placeholder="نام امانت‌گیرنده" /></label>
        <label>تاریخ امانت *<input name="borrow_date" type="date" defaultValue={todayIsoDate()} /></label>
      </form>
    </BookModalFrame>
  );
}
