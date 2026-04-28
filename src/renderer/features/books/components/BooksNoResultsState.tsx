import type { ReactElement } from "react";
import { FilterX, Plus, SearchX, X } from "lucide-react";
import type { BookFilter } from "../types";

type BooksNoResultsStateProps = {
  activeFilters: Set<BookFilter>;
  onAdd: () => void;
  onClearFilters: () => void;
  onClearSearch: () => void;
  search: string;
};

const filterLabels: Record<BookFilter, string> = {
  available: "در دسترس",
  loaned: "امانت داده شده",
  overdue: "معوق"
};

export function BooksNoResultsState({
  activeFilters,
  onAdd,
  onClearFilters,
  onClearSearch,
  search
}: BooksNoResultsStateProps): ReactElement {
  return (
    <section className="books-no-results">
      <div className="books-search-illustration" aria-hidden="true">
        <span className="search-lens" />
        <span className="search-books"><i /><i /><i /><i /></span>
        <span className="search-plant" />
      </div>
      <h2>نتیجه‌ای پیدا نشد</h2>
      <p>برای جستجوی شما یا فیلترهای فعلی کتابی یافت نشد.</p>

      <div className="no-results-chip-grid">
        <section>
          <h3>جستجوی شما</h3>
          {search ? <button className="filter-chip" onClick={onClearSearch} type="button"><X size={16} />{search}</button> : null}
        </section>
        <section>
          <h3>فیلترهای فعال</h3>
          {[...activeFilters].map((filter) => (
            <button className="filter-chip" key={filter} onClick={onClearFilters} type="button">
              <X size={16} />
              {filterLabels[filter]}
            </button>
          ))}
        </section>
      </div>

      <div className="no-results-actions">
        <button className="books-primary-action" onClick={onAdd} type="button"><Plus size={20} />افزودن کتاب جدید</button>
        <button className="books-tool-button" onClick={onClearFilters} type="button"><FilterX size={20} />حذف فیلترها</button>
        <button className="books-tool-button" onClick={onClearSearch} type="button"><SearchX size={20} />پاک کردن جستجو</button>
      </div>
    </section>
  );
}
