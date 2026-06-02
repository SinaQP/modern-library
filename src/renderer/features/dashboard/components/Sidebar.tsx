import type { ReactElement } from "react";
import { BookOpen } from "lucide-react";
import { sidebarItems } from "../dashboardData";

type SidebarProps = {
  activeItem?: "dashboard" | "books" | "loans" | "borrowers" | "settings";
  isEmpty: boolean;
};

const v1SidebarItems = sidebarItems.filter((item) => item.key === "books");

export function Sidebar({ activeItem = "books", isEmpty }: SidebarProps): ReactElement {
  return (
    <aside className="dashboard-sidebar" aria-label="ناوبری اصلی">
      <div className="sidebar-content">
        <div className="sidebar-brand">
          <span className="sidebar-brand__mark" aria-hidden="true">
            <BookOpen size={32} />
          </span>
          <div className="sidebar-brand__text">
            <p>سامانه مدیریت</p>
            <strong>کتابخانه شخصی</strong>
          </div>
        </div>

        <nav className="sidebar-menu">
          {v1SidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.key === activeItem || activeItem === "dashboard";
            return (
              <button
                className={isActive ? "sidebar-menu__item is-active" : "sidebar-menu__item"}
                key={item.label}
                onClick={() => {
                  window.location.hash = "#books";
                }}
                type="button"
              >
                <Icon size={24} aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {isEmpty ? (
        <div className="sidebar-status">
          <span>نسخه 1.0.0</span>
          <strong><i aria-hidden="true" />آماده</strong>
        </div>
      ) : null}
    </aside>
  );
}
