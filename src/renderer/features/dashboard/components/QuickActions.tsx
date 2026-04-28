import type { ReactElement } from "react";
import { quickActions } from "../dashboardData";

export function QuickActions(): ReactElement {
  return (
    <section className="panel quick-actions">
      <header className="panel__header">
        <h2>دسترسی سریع</h2>
      </header>
      <div className="quick-actions__grid">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button className="quick-action" key={action.label} type="button">
              <Icon size={36} aria-hidden="true" />
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
