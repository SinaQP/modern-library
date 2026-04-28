import type { ReactElement } from "react";
import { Plus, Settings, UserPlus } from "lucide-react";

export function EmptyDashboardHero(): ReactElement {
  return (
    <section className="panel empty-hero">
      <div className="empty-illustration" aria-hidden="true">
        <span className="spark spark-a" />
        <span className="spark spark-b" />
        <span className="empty-shelf"><i /><i /><i /><i /></span>
        <span className="empty-plant" />
        <span className="empty-box"><i /></span>
        <span className="doodle-line" />
      </div>

      <div className="empty-hero__copy">
        <h2>هنوز کتابی ثبت نشده است</h2>
        <p>به نظر می‌رسد کتابخانه شما هنوز خالی است.</p>
        <p>با افزودن اولین کتاب و ثبت امانت‌ها، اطلاعات و فعالیت‌ها در اینجا نمایش داده می‌شود.</p>
        <div className="empty-hero__actions">
          <button className="primary-action" type="button">
            <Plus size={20} aria-hidden="true" />
            <span>افزودن اولین کتاب</span>
          </button>
          <button className="secondary-action" type="button">
            <UserPlus size={18} aria-hidden="true" />
            <span>تعریف امانت‌گیرنده</span>
          </button>
          <button className="secondary-action" type="button">
            <Settings size={18} aria-hidden="true" />
            <span>تنظیمات برنامه</span>
          </button>
        </div>
      </div>
    </section>
  );
}
