import type { ReactElement } from "react";
import { BookPlus, Image, Plus } from "lucide-react";
import { BookModalFrame } from "./BookModalFrame";

type AddBookModalProps = {
  onClose: () => void;
  onSubmit: () => void;
};

export function AddBookModal({ onClose, onSubmit }: AddBookModalProps): ReactElement {
  return (
    <BookModalFrame icon={BookPlus} onClose={onClose} title="افزودن کتاب">
      <div className="book-form-layout">
        <aside className="cover-upload-box">
          <Image size={42} aria-hidden="true" />
          <strong>تصویر جلد کتاب</strong>
          <span>حداکثر 2MB، PNG, JPG</span>
          <button type="button">انتخاب تصویر</button>
        </aside>
        <form className="book-modal-form" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
          <FormGrid />
          <footer className="book-modal__footer">
            <button className="books-secondary-button" onClick={onClose} type="button">انصراف</button>
            <button className="books-primary-action" type="submit"><Plus size={20} />افزودن کتاب</button>
          </footer>
        </form>
      </div>
    </BookModalFrame>
  );
}

function FormGrid(): ReactElement {
  return (
    <>
      <label>عنوان کتاب *<input placeholder="مثلا: شمعی در باد" /></label>
      <label>نویسنده *<input placeholder="مثلا: فاطمه معتمدآریا" /></label>
      <label>مترجم<input placeholder="مثلا: سارا مجیدی" /></label>
      <label>دسته‌بندی *<select defaultValue="داستان فارسی"><option>داستان فارسی</option></select></label>
      <label>ناشر<input placeholder="مثلا: نشر نیلوفر" /></label>
      <label>شابک (ISBN)<input placeholder="مثلا: 978-622-01-1234-7" /></label>
      <label>سال انتشار<input placeholder="مثلا: ۱۴۰۳" /></label>
      <label>تعداد نسخه *<input placeholder="۱" /></label>
      <label className="form-wide">توضیحات<textarea placeholder="توضیحی درباره کتاب بنویسید..." /></label>
    </>
  );
}
