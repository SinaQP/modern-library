import type { ReactElement } from "react";
import { ChevronDown, Plus, Search } from "lucide-react";
import { DueBooks } from "./DueBooks";
import { NewBooks } from "./NewBooks";
import { QuickActions } from "./QuickActions";
import { RecentActivities } from "./RecentActivities";
import { Sidebar } from "./Sidebar";
import { StatsCard } from "./StatsCard";
import { stats } from "../dashboardData";

export function DashboardPage(): ReactElement {
  return (
    <div className="dashboard-shell" dir="rtl">
      <Sidebar />
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="dashboard-title">
            <h1>داشبورد</h1>
            <p>نمای کلی از وضعیت کتابخانه شخصی شما</p>
          </div>

          <div className="dashboard-actions" aria-label="ابزارهای داشبورد">
            <button className="primary-action" type="button">
              <Plus size={20} aria-hidden="true" />
              <span>افزودن کتاب</span>
            </button>
            <button className="filter-action" type="button">
              <ChevronDown size={18} aria-hidden="true" />
              <span>فیلتر</span>
            </button>
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

        <section className="stats-grid" aria-label="آمار کتابخانه">
          {stats.map((stat) => (
            <StatsCard key={stat.title} stat={stat} />
          ))}
        </section>

        <section className="dashboard-grid dashboard-grid--middle">
          <QuickActions />
          <DueBooks />
        </section>

        <section className="dashboard-grid dashboard-grid--bottom">
          <NewBooks />
          <RecentActivities />
        </section>
      </main>
    </div>
  );
}
