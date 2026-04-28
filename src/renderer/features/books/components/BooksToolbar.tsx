import type { ReactElement } from "react";
import { BookPlus, RotateCcw, Search, SlidersHorizontal, Trash2, UserPlus, X, Pencil } from "lucide-react";

type BooksToolbarProps = {
  onAdd: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onLoan: () => void;
  onReturn: () => void;
  onSearchChange: (value: string) => void;
  search: string;
  selectedCount: number;
};

export function BooksToolbar({
  onAdd,
  onDelete,
  onEdit,
  onLoan,
  onReturn,
  onSearchChange,
  search,
  selectedCount
}: BooksToolbarProps): ReactElement {
  const hasSelection = selectedCount > 0;

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

        <button className="books-tool-button" type="button">
          <SlidersHorizontal size={20} aria-hidden="true" />
          <span>مرتب‌سازی</span>
        </button>
        <button className="books-tool-button" disabled={!hasSelection} onClick={onReturn} type="button">
          <RotateCcw size={20} aria-hidden="true" />
          <span>بازگردانی</span>
        </button>
        <button className="books-tool-button" disabled={!hasSelection} onClick={onLoan} type="button">
          <UserPlus size={20} aria-hidden="true" />
          <span>امانت دادن</span>
        </button>
        <button className="books-tool-button" disabled={!hasSelection} onClick={onDelete} type="button">
          <Trash2 size={20} aria-hidden="true" />
          <span>حذف</span>
        </button>
        <button className="books-tool-button" disabled={!hasSelection} onClick={onEdit} type="button">
          <Pencil size={20} aria-hidden="true" />
          <span>ویرایش</span>
        </button>
        <button className="books-primary-action" onClick={onAdd} type="button">
          <BookPlus size={20} aria-hidden="true" />
          <span>افزودن کتاب</span>
        </button>
      </div>
    </header>
  );
}
