import type { ReactElement } from "react";
import { BookOpen } from "lucide-react";
import { sidebarItems } from "../dashboardData";

type SidebarProps = {
  isEmpty: boolean;
};

export function Sidebar({ isEmpty }: SidebarProps): ReactElement {
  return (
    <aside className="dashboard-sidebar" aria-label="ناوبری اصلی">
      <div className="sidebar-content">
        <div className="sidebar-brand">
          <span className="sidebar-brand__mark" aria-hidden="true">
            <BookOpen size={32} />
          </span>
          <div>
            <p>سامانه مدیریت</p>
            <strong>کتابخانه شخصی</strong>
          </div>
        </div>

        <nav className="sidebar-menu">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                className={item.isActive ? "sidebar-menu__item is-active" : "sidebar-menu__item"}
                key={item.label}
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
          <span>نسخه ۱.۰.۰</span>
          <strong><i aria-hidden="true" />آنلاین</strong>
        </div>
      ) : null}
    </aside>
  );
}
