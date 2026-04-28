import type { ReactElement } from "react";
import { DashboardHeader } from "./DashboardHeader";
import { DueBooks } from "./DueBooks";
import { EmptyDashboardHero } from "./EmptyDashboardHero";
import { EmptyStateCard } from "./EmptyStateCard";
import { GettingStartedGuide } from "./GettingStartedGuide";
import { NewBooks } from "./NewBooks";
import { QuickActions } from "./QuickActions";
import { RecentActivities } from "./RecentActivities";
import { Sidebar } from "./Sidebar";
import { StatsCard } from "./StatsCard";
import { emptyStateCards, emptyStats, populatedBooks, populatedStats } from "../dashboardData";

export function DashboardPage(): ReactElement {
  const forceEmptyDashboard =
    new URLSearchParams(window.location.search).get("state") === "empty" ||
    window.location.hash === "#empty";
  const books = forceEmptyDashboard ? [] : populatedBooks;
  const isEmpty = books.length === 0;
  const visibleStats = isEmpty ? emptyStats : populatedStats;
  
  function navigateToBooks(params?: Record<string, string>) {
    const query = new URLSearchParams(params).toString();
    window.location.hash = query ? `#books?${query}` : "#books";
  }

  return (
    <div className={isEmpty ? "dashboard-shell is-empty-dashboard" : "dashboard-shell"} dir="rtl">
      <Sidebar activeItem="dashboard" isEmpty={isEmpty} />
      <main className="dashboard-main">
        <DashboardHeader
          isEmpty={isEmpty}
          onAddBook={() => navigateToBooks({ action: "add" })}
          onOpenFilter={() => navigateToBooks({ filter: "available" })}
          onSearch={(query) => navigateToBooks({ search: query })}
        />

        <section className="stats-grid" aria-label="آمار کتابخانه">
          {visibleStats.map((stat) => (
            <StatsCard key={stat.title} stat={stat} />
          ))}
        </section>

        {isEmpty ? (
          <>
            <EmptyDashboardHero />
            <section className="empty-lower-grid">
              {emptyStateCards.map((config) => (
                <EmptyStateCard config={config} key={config.title} />
              ))}
              <GettingStartedGuide />
            </section>
          </>
        ) : (
          <>
            <section className="dashboard-grid dashboard-grid--middle">
              <QuickActions />
              <DueBooks />
            </section>

            <section className="dashboard-grid dashboard-grid--bottom">
              <NewBooks />
              <RecentActivities />
            </section>
          </>
        )}
      </main>
    </div>
  );
}
