import { useState, type ReactElement } from "react";
import { AppLayout } from "../../../app/layout/AppLayout";
import { ErrorState } from "../../../components/ui/ErrorState";
import { LoadingState } from "../../../components/ui/LoadingState";
import { BookGrid } from "./BookGrid";
import { BookList } from "./BookList";
import { BooksEmptyState } from "./BooksEmptyState";
import { BooksFilterTabs } from "./BooksFilterTabs";
import { BooksModalHost } from "./BooksModalHost";
import { BooksNoResultsState } from "./BooksNoResultsState";
import { BooksPagination } from "./BooksPagination";
import { BooksToolbar } from "./BooksToolbar";
import { BooksViewControls } from "./BooksViewControls";
import { ToastNotification } from "./ToastNotification";
import { useBooksPageState } from "../hooks/useBooksPageState";
import type { BookRecord, BookViewMode } from "../types";

type BooksPageProps = {
  routeState: string;
};

export function BooksPage({ routeState }: BooksPageProps): ReactElement {
  const booksState = useBooksPageState(routeState);
  const [viewMode, setViewMode] = useState<BookViewMode>("grid");

  const bookActionProps = {
    onDelete: (book: BookRecord) => booksState.openBookModal("delete", book.id),
    onEdit: (book: BookRecord) => booksState.openBookModal("edit", book.id),
    onLoan: (book: BookRecord) => booksState.openBookModal("loan", book.id),
    onOpenDetails: (book: BookRecord) => booksState.openBookModal("details", book.id),
    onReturn: (book: BookRecord) => booksState.openBookModal("return", book.id),
    onToggleSaved: (book: BookRecord) => booksState.toggleSavedBook(book.id),
    savedBookIds: booksState.savedBookIds
  };

  function renderContent(): ReactElement {
    if (booksState.isLoading) {
      return <LoadingState />;
    }

    if (booksState.loadError) {
      return <ErrorState message={booksState.loadError} onRetry={booksState.refresh} />;
    }

    if (booksState.showEmptyState) {
      return <BooksEmptyState onAdd={booksState.openAddModal} />;
    }

    if (booksState.showNoResultsState) {
      return (
        <BooksNoResultsState
          activeFilters={booksState.activeFilters}
          onAdd={booksState.openAddModal}
          onClearFilters={booksState.clearFilters}
          onClearSearch={booksState.clearSearch}
          search={booksState.search}
        />
      );
    }

    return viewMode === "grid" ? (
      <BookGrid books={booksState.paginatedBooks} {...bookActionProps} />
    ) : (
      <BookList books={booksState.paginatedBooks} {...bookActionProps} />
    );
  }

  return (
    <AppLayout activeItem="books" mainClassName="books-main" shellClassName="books-shell">
      <BooksToolbar
        onAdd={booksState.openAddModal}
        onSearchChange={booksState.setSearch}
        onSortChange={booksState.setSortOption}
        search={booksState.search}
        sortOption={booksState.sortOption}
      />

      <BooksFilterTabs
        activeFilters={booksState.activeFilters}
        onClearFilters={booksState.clearFilters}
        onToggleFilter={booksState.toggleFilter}
      />
      <BooksViewControls onViewModeChange={setViewMode} viewMode={viewMode} />

      {booksState.actionError ? <p className="page-alert" role="alert">{booksState.actionError}</p> : null}
      {renderContent()}

      {!booksState.isLoading && !booksState.loadError ? (
        <BooksPagination
          currentPage={booksState.currentPage}
          onPageChange={booksState.setCurrentPage}
          pageCount={booksState.pageCount}
          pageSize={booksState.pageSize}
          total={booksState.sortedBooks.length}
          visibleCount={booksState.paginatedBooks.length}
        />
      ) : null}

      <BooksModalHost
        activeModal={booksState.activeModal}
        book={booksState.activeBook}
        isSubmitting={booksState.isMutating}
        onClose={booksState.closeModal}
        onDelete={booksState.submitDeleteBook}
        onOpenBookModal={booksState.openBookModal}
        onSubmitAdd={booksState.submitAddBook}
        onSubmitEdit={booksState.submitEditBook}
        onSubmitLoan={booksState.submitLoanBook}
        onSubmitReturn={booksState.submitReturnBook}
      />
      <ToastNotification onClose={booksState.closeToast} toasts={booksState.toasts} />
    </AppLayout>
  );
}
