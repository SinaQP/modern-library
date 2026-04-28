import type { ReactElement } from "react";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { ErrorState } from "../../../components/ui/ErrorState";
import { LoadingState } from "../../../components/ui/LoadingState";
import { AddBookModal } from "./AddBookModal";
import { DashboardContent } from "./DashboardContent";
import { useLibraryDashboard } from "../hooks/useLibraryDashboard";
import { returnBorrowedBook } from "../services/libraryService";

export function LibraryPage(): ReactElement {
  const { filters, refresh, setSearch, setStatus, state } = useLibraryDashboard();
  const [actionError, setActionError] = useState("");
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [returningBookId, setReturningBookId] = useState<number | null>(null);

  async function handleReturnBook(bookId: number) {
    setActionError("");
    setReturningBookId(bookId);

    try {
      await returnBorrowedBook(bookId);
      await refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "بازگشت کتاب ناموفق بود.";
      setActionError(message);
    } finally {
      setReturningBookId(null);
    }
  }

  function renderContent(): ReactElement {
    if (state.status === "idle" || state.status === "loading") {
      return <LoadingState />;
    }

    if (state.status === "error") {
      return <ErrorState message={state.error} onRetry={refresh} />;
    }

    return (
      <DashboardContent
        data={state.data}
        filters={filters}
        onAddBook={() => setIsAddBookOpen(true)}
        onRefresh={refresh}
        onReturnBook={handleReturnBook}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        returningBookId={returningBookId}
      />
    );
  }

  return (
    <div className="library-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">داشبورد کتابخانه</p>
          <h1>مدیریت کتاب‌های شخصی</h1>
          <span>جستجو، ثبت و پیگیری وضعیت امانت کتاب‌ها در یک فضای منظم.</span>
        </div>
        <Button
          icon={<Plus size={18} aria-hidden="true" />}
          onClick={() => setIsAddBookOpen(true)}
          variant="primary"
        >
          افزودن کتاب
        </Button>
      </header>

      {actionError ? <p className="page-alert" role="alert">{actionError}</p> : null}
      {renderContent()}

      <AddBookModal
        isOpen={isAddBookOpen}
        onClose={() => setIsAddBookOpen(false)}
        onCreated={refresh}
      />
    </div>
  );
}
