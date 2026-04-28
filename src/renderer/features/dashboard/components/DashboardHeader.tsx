import type { ReactElement } from "react";
import { ChevronDown, Plus, Search, Settings } from "lucide-react";

type DashboardHeaderProps = {
  isEmpty: boolean;
};

export function DashboardHeader({ isEmpty }: DashboardHeaderProps): ReactElement {
  return (
    <header className="dashboard-header">
      <div className="dashboard-title">
        <h1>داشبورد</h1>
        <p>{isEmpty ? "شروع مدیریت کتابخانه شخصی شما" : "نمای کلی از وضعیت کتابخانه شخصی شما"}</p>
      </div>

      <div className="dashboard-actions" aria-label="ابزارهای داشبورد">
        <button className="primary-action" type="button">
          <Plus size={20} aria-hidden="true" />
          <span>{isEmpty ? "افزودن اولین کتاب" : "افزودن کتاب"}</span>
        </button>
        {isEmpty ? (
          <button className="secondary-action" type="button">
            <Settings size={18} aria-hidden="true" />
            <span>تنظیمات اولیه</span>
          </button>
        ) : (
          <button className="filter-action" type="button">
            <ChevronDown size={18} aria-hidden="true" />
            <span>فیلتر</span>
          </button>
        )}
        <label className="dashboard-search" htmlFor="dashboardSearch">
          <Search size={24} aria-hidden="true" />
          <input
            autoComplete="off"
            id="dashboardSearch"
            placeholder="جستجو در عنوان، نویسنده، ناشر، ISBN..."
            type="search"
          />
        </label>
      </div>
    </header>
  );
}
