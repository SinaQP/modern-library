import type { ReactElement } from "react";
import { AlertTriangle, Bookmark, FilterX, Grid2X2, HandHeart } from "lucide-react";
import type { BookFilter } from "../types";

type BooksFilterTabsProps = {
  activeFilters: Set<BookFilter>;
  onClearFilters: () => void;
  onToggleFilter: (filter: BookFilter) => void;
};

export function BooksFilterTabs({
  activeFilters,
  onClearFilters,
  onToggleFilter
}: BooksFilterTabsProps): ReactElement {
  const isAllActive = activeFilters.size === 0;

  return (
    <section className="books-filter-tabs" aria-label="فیلترهای کتاب">
      <button
        className={isAllActive ? "books-filter-tab is-active" : "books-filter-tab"}
        onClick={onClearFilters}
        type="button"
      >
        <Grid2X2 size={22} aria-hidden="true" />
        <span>همه</span>
      </button>
      <button
        className={activeFilters.has("available") ? "books-filter-tab is-selected" : "books-filter-tab"}
        onClick={() => onToggleFilter("available")}
        type="button"
      >
        <Bookmark size={22} aria-hidden="true" />
        <i className="filter-dot filter-dot--teal" />
        <span>در دسترس</span>
      </button>
      <button
        className={activeFilters.has("loaned") ? "books-filter-tab is-selected" : "books-filter-tab"}
        onClick={() => onToggleFilter("loaned")}
        type="button"
      >
        <HandHeart size={22} aria-hidden="true" />
        <i className="filter-dot filter-dot--orange" />
        <span>امانت داده شده</span>
      </button>
      <button
        className={activeFilters.has("overdue") ? "books-filter-tab is-selected" : "books-filter-tab"}
        onClick={() => onToggleFilter("overdue")}
        type="button"
      >
        <AlertTriangle size={22} aria-hidden="true" />
        <span>معوق</span>
      </button>
      <button className="books-filter-clear" onClick={onClearFilters} type="button">
        <FilterX size={22} aria-hidden="true" />
        <span>پاک کردن فیلترها</span>
      </button>
    </section>
  );
}
