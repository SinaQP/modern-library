import type { ReactElement } from "react";
import { ChevronDown } from "lucide-react";

type BooksPaginationProps = {
  currentPage: number;
  pageCount: number;
  pageSize: number;
  total: number;
  visibleCount: number;
  onPageChange: (page: number) => void;
};

function getPageNumbers(currentPage: number, pageCount: number): number[] {
  const firstPage = Math.max(1, currentPage - 2);
  const lastPage = Math.min(pageCount, firstPage + 4);
  const adjustedFirstPage = Math.max(1, lastPage - 4);

  return Array.from(
    { length: lastPage - adjustedFirstPage + 1 },
    (_, index) => adjustedFirstPage + index
  );
}

export function BooksPagination({
  currentPage,
  pageCount,
  pageSize,
  total,
  visibleCount,
  onPageChange
}: BooksPaginationProps): ReactElement {
  const firstVisibleItem = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastVisibleItem = total === 0 ? 0 : firstVisibleItem + visibleCount - 1;
  const rangeText =
    total === 0
      ? "نمایش ۰ تا ۰ از ۰ کتاب"
      : `نمایش ${firstVisibleItem.toLocaleString("fa-IR")} تا ${lastVisibleItem.toLocaleString("fa-IR")} از ${total.toLocaleString("fa-IR")} کتاب`;

  return (
    <footer className="books-pagination">
      <div className="books-page-size">
        <span>تعداد در صفحه:</span>
        <button type="button" disabled>
          <ChevronDown size={18} aria-hidden="true" />
          <span>{pageSize.toLocaleString("fa-IR")}</span>
        </button>
      </div>

      {pageCount > 1 ? (
        <nav className="books-page-nav" aria-label="صفحه‌بندی کتاب‌ها">
          <button
            type="button"
            disabled={currentPage >= pageCount}
            onClick={() => onPageChange(currentPage + 1)}
          >
            بعدی
          </button>
          {getPageNumbers(currentPage, pageCount).map((pageNumber) => (
            <button
              className={pageNumber === currentPage ? "is-active" : undefined}
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber.toLocaleString("fa-IR")}
            </button>
          ))}
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            قبلی
          </button>
        </nav>
      ) : null}

      <p>{rangeText}</p>
    </footer>
  );
}
