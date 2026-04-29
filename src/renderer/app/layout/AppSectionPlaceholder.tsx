import type { ReactElement } from "react";
import { BookOpen } from "lucide-react";
import { sidebarItems } from "../../features/dashboard/dashboardData";
import { AppLayout } from "./AppLayout";

type PlaceholderSection = "loans" | "borrowers" | "settings";

const sectionCopy: Record<PlaceholderSection, string> = {
  borrowers: "مدیریت امانت‌گیرندگان با همان ساختار صفحه و نوار کناری نمایش داده می‌شود.",
  loans: "ثبت و پیگیری امانت‌ها با همان ساختار صفحه و نوار کناری نمایش داده می‌شود.",
  settings: "تنظیمات کتابخانه با همان ساختار صفحه و نوار کناری نمایش داده می‌شود."
};

export function AppSectionPlaceholder({ section }: { section: PlaceholderSection }): ReactElement {
  const item = sidebarItems.find((sidebarItem) => sidebarItem.key === section);
  const Icon = item?.icon ?? BookOpen;
  const title = item?.label ?? "کتابخانه";

  return (
    <AppLayout activeItem={section} mainClassName="dashboard-main app-placeholder-main">
      <section className="panel app-placeholder-card">
        <span className="app-placeholder-card__icon" aria-hidden="true">
          <Icon size={36} />
        </span>
        <h1>{title}</h1>
        <p>{sectionCopy[section]}</p>
      </section>
    </AppLayout>
  );
}
