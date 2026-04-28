import type { KeyboardEvent, ReactElement } from "react";
import { useState } from "react";
import { ChevronDown, Plus, Search, Settings } from "lucide-react";

type DashboardHeaderProps = {
  isEmpty: boolean;
  onAddBook: () => void;
  onOpenFilter: () => void;
  onSearch: (query: string) => void;
};

export function DashboardHeader({
  isEmpty,
  onAddBook,
  onOpenFilter,
  onSearch
}: DashboardHeaderProps): ReactElement {
  const [searchQuery, setSearchQuery] = useState("");

  function submitSearch() {
    onSearch(searchQuery);
  }

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    submitSearch();
  }

  return (
    <header className="dashboard-header">
      <div className="dashboard-title">
        <h1>داشبورد</h1>
        <p>{isEmpty ? "شروع مدیریت کتابخانه شخصی شما" : "نمای کلی از وضعیت کتابخانه شخصی شما"}</p>
      </div>

      <div className="dashboard-actions" aria-label="ابزارهای داشبورد">
        <button className="primary-action" onClick={onAddBook} type="button">
          <Plus size={20} aria-hidden="true" />
          <span>{isEmpty ? "افزودن اولین کتاب" : "افزودن کتاب"}</span>
        </button>
        {isEmpty ? (
          <button className="secondary-action" type="button">
            <Settings size={18} aria-hidden="true" />
            <span>تنظیمات اولیه</span>
          </button>
        ) : (
          <button className="filter-action" onClick={onOpenFilter} type="button">
            <ChevronDown size={18} aria-hidden="true" />
            <span>فیلتر</span>
          </button>
        )}
        <label className="dashboard-search" htmlFor="dashboardSearch">
          <Search size={24} aria-hidden="true" />
          <input
            autoComplete="off"
            id="dashboardSearch"
            onChange={(event) => setSearchQuery(event.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="جستجو در عنوان، نویسنده، ناشر، ISBN..."
            type="search"
            value={searchQuery}
          />
        </label>
      </div>
    </header>
  );
}
