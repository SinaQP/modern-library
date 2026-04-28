import type { ReactElement } from "react";
import { CalendarDays, RotateCcw } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import type { BookRecord } from "../types";
import { BOOK_STATUS } from "../types";
import { getOptionalText, toPersianNumber } from "../lib/formatters";

type BookTableProps = {
  books: BookRecord[];
  onReturnBook: (bookId: number) => void;
  returningBookId: number | null;
};

export function BookTable({
  books,
  onReturnBook,
  returningBookId
}: BookTableProps): ReactElement {
  return (
    <div className="table-shell">
      <table className="book-table">
        <thead>
          <tr>
            <th>کتاب</th>
            <th>دسته‌بندی</th>
            <th>سال</th>
            <th>وضعیت</th>
            <th>امانت‌گیرنده</th>
            <th aria-label="اقدام‌ها" />
          </tr>
        </thead>
        <tbody>
          {books.map((book) => {
            const isBorrowed = book.status === BOOK_STATUS.BORROWED;
            return (
              <tr key={book.id}>
                <td>
                  <div className="book-title-cell">
                    <span>{book.title}</span>
                    <small>{book.author}</small>
                  </div>
                </td>
                <td>{getOptionalText(book.category)}</td>
                <td>{book.publish_year ? toPersianNumber(book.publish_year) : "ثبت نشده"}</td>
                <td>
                  <span className={isBorrowed ? "status-pill status-pill--borrowed" : "status-pill"}>
                    {book.status}
                  </span>
                </td>
                <td>
                  {isBorrowed ? (
                    <span className="borrower-cell">
                      {book.borrower_name}
                      <small>
                        <CalendarDays size={14} aria-hidden="true" />
                        {book.borrow_date}
                      </small>
                    </span>
                  ) : (
                    "ثبت نشده"
                  )}
                </td>
                <td>
                  {isBorrowed ? (
                    <Button
                      icon={<RotateCcw size={16} aria-hidden="true" />}
                      isLoading={returningBookId === book.id}
                      onClick={() => onReturnBook(book.id)}
                      size="sm"
                    >
                      بازگشت
                    </Button>
                  ) : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
