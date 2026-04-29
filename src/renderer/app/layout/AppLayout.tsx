import type { ReactElement, ReactNode } from "react";
import { classNames } from "../../lib/classNames";
import { Sidebar } from "../../features/dashboard/components/Sidebar";

type AppLayoutProps = {
  activeItem: "dashboard" | "books" | "loans" | "borrowers" | "settings";
  children: ReactNode;
  isEmpty?: boolean;
  mainClassName: string;
  shellClassName?: string;
};

export function AppLayout({
  activeItem,
  children,
  isEmpty = false,
  mainClassName,
  shellClassName
}: AppLayoutProps): ReactElement {
  return (
    <div className={classNames("app-shell dashboard-shell", shellClassName)} dir="rtl">
      <Sidebar activeItem={activeItem} isEmpty={isEmpty} />
      <main className={classNames("app-main", mainClassName)}>
        {children}
      </main>
    </div>
  );
}
