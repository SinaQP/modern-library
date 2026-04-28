import type { ReactElement } from "react";
import { HandHeart } from "lucide-react";
import { BookModalFrame } from "./BookModalFrame";
import { BookSummaryCard } from "./BookSummaryCard";
import type { BookRecord } from "../types";

type LoanBookModalProps = {
  book: BookRecord;
  onClose: () => void;
  onSubmit: () => void;
};

export function LoanBookModal({ book, onClose, onSubmit }: LoanBookModalProps): ReactElement {
  return (
    <BookModalFrame icon={HandHeart} onClose={onClose} title="ثبت امانت">
      <form className="book-modal-form book-modal-form--single" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
        <BookSummaryCard book={book} />
        <label className="form-wide">امانت‌گیرنده *<input placeholder="جستجو و انتخاب امانت‌گیرنده..." /></label>
        <label>تاریخ امانت *<input defaultValue="۱۴۰۴/۰۳/۱۲" /></label>
        <label>تاریخ بازگشت *<input defaultValue="۱۴۰۴/۰۳/۲۱" /></label>
        <label className="form-wide">یادداشت<textarea placeholder="یادداشتی اختیاری وارد کنید..." /></label>
        <footer className="book-modal__footer">
          <button className="books-secondary-button" onClick={onClose} type="button">انصراف</button>
          <button className="books-primary-action" type="submit">ثبت امانت</button>
        </footer>
      </form>
    </BookModalFrame>
  );
}
