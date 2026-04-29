import type { ReactElement } from "react";
import { ChevronDown } from "lucide-react";

type BooksPaginationProps = {
  total: number;
};

export function BooksPagination({ total }: BooksPaginationProps): ReactElement {
  const visibleCount = Math.min(total, 8);
  const rangeText =
    total === 0
      ? "نمایش ۰ تا ۰ از ۰ کتاب"
      : `نمایش ۱ تا ${visibleCount.toLocaleString("fa-IR")} از ${total.toLocaleString("fa-IR")} کتاب`;

  return (
    <footer className="books-pagination">
      <div className="books-page-size">
        <span>تعداد در صفحه:</span>
        <button type="button">
          <ChevronDown size={18} aria-hidden="true" />
          <span>۸</span>
        </button>
      </div>

      {total > 0 ? (
        <nav className="books-page-nav" aria-label="صفحه‌بندی کتاب‌ها">
          <button type="button">بعدی</button>
          <button className="is-active" type="button">۱</button>
          <button type="button">۲</button>
          <button type="button">۳</button>
          <span>...</span>
          <button type="button">۶</button>
          <button type="button">قبلی</button>
        </nav>
      ) : null}

      <p>{rangeText}</p>
    </footer>
  );
}
