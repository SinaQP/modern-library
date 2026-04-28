import type { ReactElement } from "react";
import type { StatItem } from "../dashboardData";

type StatsCardProps = {
  stat: StatItem;
};

export function StatsCard({ stat }: StatsCardProps): ReactElement {
  const Icon = stat.icon;

  return (
    <article className={`stats-card stats-card--${stat.tone}`}>
      <div className="stats-card__copy">
        <h2>{stat.title}</h2>
        <strong>{stat.value}</strong>
        {stat.unit ? <span>{stat.unit}</span> : null}
        {stat.subtitle ? <p>{stat.subtitle}</p> : null}
        {stat.detail ? <small>{stat.detail}</small> : null}
      </div>
      <span className="stats-card__icon" aria-hidden="true">
        <Icon size={34} />
      </span>
    </article>
  );
}
