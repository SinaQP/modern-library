import type { ReactElement } from "react";
import { BookOpen, Download, HelpCircle, Plus } from "lucide-react";

type BooksEmptyStateProps = {
  onAdd: () => void;
};

export function BooksEmptyState({ onAdd }: BooksEmptyStateProps): ReactElement {
  return (
    <section className="books-empty-card">
      <div className="books-empty-illustration" aria-hidden="true">
        <span className="books-empty-shelf"><i /><i /><i /><i /><i /></span>
        <span className="books-empty-picture" />
        <span className="books-empty-plant" />
        <span className="books-empty-stack" />
      </div>

      <div className="books-empty-content">
        <span className="books-empty-icon" aria-hidden="true">
          <BookOpen size={46} />
        </span>
        <h2>هنوز کتابی ثبت نشده است</h2>
        <p>برای شروع، اولین کتاب را به کتابخانه شخصی خود اضافه کنید.</p>
        <button className="books-primary-action books-empty-primary" onClick={onAdd} type="button">
          <Plus size={22} aria-hidden="true" />
          <span>افزودن اولین کتاب</span>
        </button>
        <div className="books-empty-divider"><span>یا</span></div>
        <div className="books-empty-secondary">
          <button type="button"><Download size={22} aria-hidden="true" />ورود اطلاعات</button>
          <button type="button"><HelpCircle size={22} aria-hidden="true" />راهنما</button>
        </div>
      </div>
    </section>
  );
}
