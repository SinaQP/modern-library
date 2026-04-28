import type { ReactElement, ReactNode } from "react";

type EmptyStateProps = {
  action?: ReactNode;
  description: string;
  icon: ReactNode;
  title: string;
};

export function EmptyState({ action, description, icon, title }: EmptyStateProps): ReactElement {
  return (
    <div className="state-card">
      <span className="state-card__icon" aria-hidden="true">
        {icon}
      </span>
      <h2>{title}</h2>
      <p>{description}</p>
      {action ? <div className="state-card__action">{action}</div> : null}
    </div>
  );
}
