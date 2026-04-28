import type { ChangeEvent, ReactElement } from "react";
import { Plus, RefreshCw, Search } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { TextInput } from "../../../components/ui/TextInput";
import { BOOK_STATUS } from "../types";

type LibraryToolbarProps = {
  filters: {
    search: string;
    status: string;
  };
  onAddBook: () => void;
  onRefresh: () => void;
  onSearchChange: (search: string) => void;
  onStatusChange: (status: string) => void;
};

const statusOptions = [BOOK_STATUS.ALL, BOOK_STATUS.AVAILABLE, BOOK_STATUS.BORROWED];

export function LibraryToolbar({
  filters,
  onAddBook,
  onRefresh,
  onSearchChange,
  onStatusChange
}: LibraryToolbarProps): ReactElement {
  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    onSearchChange(event.target.value);
  }

  function handleStatusChange(event: ChangeEvent<HTMLSelectElement>) {
    onStatusChange(event.target.value);
  }

  return (
    <section className="toolbar" aria-label="ابزارهای کتابخانه">
      <div className="toolbar__search">
        <TextInput
          icon={<Search size={18} aria-hidden="true" />}
          label="جستجوی کتاب"
          name="librarySearch"
          onChange={handleSearchChange}
          placeholder="عنوان، نویسنده، ناشر یا دسته‌بندی"
          type="search"
          value={filters.search}
        />
      </div>

      <label className="select-field" htmlFor="statusFilter">
        <span>وضعیت</span>
        <select id="statusFilter" onChange={handleStatusChange} value={filters.status}>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>

      <div className="toolbar__actions">
        <Button
          aria-label="بارگذاری دوباره اطلاعات"
          icon={<RefreshCw size={18} aria-hidden="true" />}
          onClick={onRefresh}
          variant="ghost"
        />
        <Button icon={<Plus size={18} aria-hidden="true" />} onClick={onAddBook} variant="primary">
          افزودن کتاب
        </Button>
      </div>
    </section>
  );
}
