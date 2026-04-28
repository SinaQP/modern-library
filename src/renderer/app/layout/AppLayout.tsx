import type { ReactElement, ReactNode } from "react";
import { BookOpen, LayoutDashboard, Settings, UsersRound } from "lucide-react";

type AppLayoutProps = {
  children: ReactNode;
};

const navigationItems = [
  { label: "داشبورد", icon: LayoutDashboard, active: true },
  { label: "کتاب‌ها", icon: BookOpen, active: false },
  { label: "امانت‌گیرندگان", icon: UsersRound, active: false },
  { label: "تنظیمات", icon: Settings, active: false }
];

export function AppLayout({ children }: AppLayoutProps): ReactElement {
  return (
    <div className="app-shell">
      <aside className="app-sidebar" aria-label="ناوبری اصلی">
        <div className="brand">
          <span className="brand__mark" aria-hidden="true">
            <BookOpen size={28} />
          </span>
          <div>
            <p>سامانه مدیریت</p>
            <strong>کتابخانه شخصی</strong>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                className={item.active ? "sidebar-link sidebar-link--active" : "sidebar-link"}
                key={item.label}
                type="button"
              >
                <Icon size={20} aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="app-main">{children}</main>
    </div>
  );
}
