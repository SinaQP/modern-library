import type { ReactElement } from "react";
import { LoaderCircle } from "lucide-react";

export function LoadingState(): ReactElement {
  return (
    <div className="state-card" role="status">
      <LoaderCircle className="state-card__spinner" size={34} aria-hidden="true" />
      <h2>در حال بارگذاری کتابخانه</h2>
      <p>اطلاعات کتاب‌ها و آمار داشبورد در حال دریافت است.</p>
    </div>
  );
}
