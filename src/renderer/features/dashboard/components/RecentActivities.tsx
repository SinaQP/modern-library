import type { ReactElement } from "react";
import { activityButtonIcon, recentActivities } from "../dashboardData";

export function RecentActivities(): ReactElement {
  const ClockIcon = activityButtonIcon;

  return (
    <section className="panel recent-activities">
      <header className="panel__header">
        <h2>فعالیت‌های اخیر</h2>
      </header>
      <ul className="activity-list">
        {recentActivities.map((activity) => {
          const Icon = activity.icon;
          return (
            <li className="activity-row" key={`${activity.text}-${activity.time}`}>
              <span className={`activity-row__icon activity-row__icon--${activity.tone}`}>
                <Icon size={18} aria-hidden="true" />
              </span>
              <p>{activity.text}</p>
              <time>{activity.time}</time>
            </li>
          );
        })}
      </ul>
      <button className="activity-more" type="button">
        <ClockIcon size={24} aria-hidden="true" />
        <span>مشاهده همه فعالیت‌ها</span>
      </button>
    </section>
  );
}
