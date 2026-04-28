import type { ReactElement } from "react";
import type { EmptyStateConfig } from "../dashboardData";

type EmptyStateCardProps = {
  config: EmptyStateConfig;
};

export function EmptyStateCard({ config }: EmptyStateCardProps): ReactElement {
  const Icon = config.icon;
  const ActionIcon = config.actionIcon;

  return (
    <section className="panel empty-state-card">
      <header className="panel__header">
        <h2>{config.title}</h2>
        <span className="empty-pill">{config.pill}</span>
      </header>
      <div className="empty-state-card__body">
        <span className="empty-state-card__icon" aria-hidden="true">
          <Icon size={31} />
        </span>
        <h3>{config.heading}</h3>
        <p>{config.text}</p>
        <button className="outline-action" type="button">
          <ActionIcon size={19} aria-hidden="true" />
          <span>{config.actionLabel}</span>
        </button>
      </div>
    </section>
  );
}
