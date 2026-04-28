import type { ReactElement } from "react";
import { Pencil, Save, Trash2 } from "lucide-react";
import { BookModalFrame } from "./BookModalFrame";
import type { BookRecord } from "../types";

type EditBookModalProps = {
  book: BookRecord;
  onClose: () => void;
  onSubmit: () => void;
};

export function EditBookModal({ book, onClose, onSubmit }: EditBookModalProps): ReactElement {
  return (
    <BookModalFrame icon={Pencil} onClose={onClose} title="ویرایش کتاب">
      <div className="book-form-layout">
        <aside className="edit-cover-panel">
          <div className={`book-cover edit-cover-panel__cover ${book.coverClass}`}>
            <span>{book.title}</span>
            <small>{book.author}</small>
          </div>
          <button type="button"><Pencil size={18} />تغییر تصویر</button>
          <button className="danger-lite" type="button"><Trash2 size={18} />حذف تصویر</button>
        </aside>
        <form className="book-modal-form" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
          <label>عنوان کتاب *<input defaultValue={book.title} /></label>
          <label>نویسنده *<input defaultValue={book.author} /></label>
          <label>مترجم<input defaultValue="سارا مجیدیه" /></label>
          <label>دسته‌بندی *<select defaultValue={book.category}><option>{book.category}</option></select></label>
          <label>ناشر<input defaultValue="نشر نیلوفر" /></label>
          <label>شابک (ISBN)<input defaultValue={book.isbn} /></label>
          <label>سال انتشار<input defaultValue="۱۴۰۳" /></label>
          <label>تعداد نسخه *<input defaultValue="۱" /></label>
          <label className="form-wide">توضیحات<textarea defaultValue="رمانی شاعرانه درباره امید و رهایی." /></label>
          <footer className="book-modal__footer">
            <button className="books-secondary-button" onClick={onClose} type="button">انصراف</button>
            <button className="books-navy-action" type="submit"><Save size={20} />ذخیره تغییرات</button>
          </footer>
        </form>
      </div>
    </BookModalFrame>
  );
}
