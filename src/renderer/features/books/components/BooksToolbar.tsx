import type { ReactElement } from "react";
import { BookPlus, Search, X } from "lucide-react";
import { BooksSortDropdown } from "./BooksSortDropdown";
import type { BookSortOption } from "../types";

type BooksToolbarProps = {
  onAdd: () => void;
  onSearchChange: (value: string) => void;
  onSortChange: (value: BookSortOption) => void;
  search: string;
  sortOption: BookSortOption;
};

export function BooksToolbar({
  onAdd,
  onSearchChange,
  onSortChange,
  search,
  sortOption
}: BooksToolbarProps): ReactElement {
  return (
    <header className="books-header">
      <div className="books-title">
        <h1>کتاب‌ها</h1>
        <p>مدیریت و سازماندهی کتاب‌های شخصی</p>
      </div>

      <div className="books-toolbar" aria-label="ابزارهای کتاب‌ها">
        <label className="books-search" htmlFor="booksSearch">
          <Search size={24} aria-hidden="true" />
          <input
            autoComplete="off"
            id="booksSearch"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="جستجو در عنوان، نویسنده، ناشر..."
            type="search"
            value={search}
          />
          {search ? (
            <button aria-label="پاک کردن جستجو" onClick={() => onSearchChange("")} type="button">
              <X size={18} aria-hidden="true" />
            </button>
          ) : null}
        </label>

        <BooksSortDropdown onChange={onSortChange} value={sortOption} />
        <button className="books-primary-action" onClick={onAdd} type="button">
          <BookPlus size={20} aria-hidden="true" />
          <span>افزودن کتاب</span>
        </button>
      </div>
    </header>
  );
}
