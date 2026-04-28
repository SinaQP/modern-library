import type { ReactElement } from "react";
import { BookOpen, Plus } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { EmptyState } from "../../../components/ui/EmptyState";
import { BookTable } from "./BookTable";
import { LibraryToolbar } from "./LibraryToolbar";
import { SummaryGrid } from "./SummaryGrid";
import { BOOK_STATUS, type LibraryDashboardData } from "../types";

type DashboardContentProps = {
  data: LibraryDashboardData;
  filters: {
    search: string;
    status: string;
  };
  onAddBook: () => void;
  onRefresh: () => Promise<void>;
  onReturnBook: (bookId: number) => void;
  onSearchChange: (search: string) => void;
  onStatusChange: (status: string) => void;
  returningBookId: number | null;
};

function hasActiveFilters(search: string, status: string): boolean {
  return Boolean(search.trim()) || status !== BOOK_STATUS.ALL;
}

export function DashboardContent({
  data,
  filters,
  onAddBook,
  onRefresh,
  onReturnBook,
  onSearchChange,
  onStatusChange,
  returningBookId
}: DashboardContentProps): ReactElement {
  const isFilteredEmpty = data.books.length === 0 && hasActiveFilters(filters.search, filters.status);

  return (
    <>
      <SummaryGrid summary={data.summary} />
      <LibraryToolbar
        filters={filters}
        onAddBook={onAddBook}
        onRefresh={() => void onRefresh()}
        onSearchChange={onSearchChange}
        onStatusChange={onStatusChange}
      />

      {data.books.length === 0 ? (
        <EmptyState
          action={
            isFilteredEmpty ? (
              <Button onClick={() => void onRefresh()}>بارگذاری دوباره</Button>
            ) : (
              <Button
                icon={<Plus size={18} aria-hidden="true" />}
                onClick={onAddBook}
                variant="primary"
              >
                افزودن اولین کتاب
              </Button>
            )
          }
          description={
            isFilteredEmpty
              ? "برای این جستجو یا فیلتر، کتابی پیدا نشد."
              : "هنوز کتابی ثبت نشده است. اولین کتاب را اضافه کنید تا داشبورد زنده شود."
          }
          icon={<BookOpen size={34} />}
          title={isFilteredEmpty ? "نتیجه‌ای پیدا نشد" : "کتابخانه خالی است"}
        />
      ) : (
        <Card title="فهرست کتاب‌ها">
          <BookTable
            books={data.books}
            onReturnBook={onReturnBook}
            returningBookId={returningBookId}
          />
        </Card>
      )}
    </>
  );
}
