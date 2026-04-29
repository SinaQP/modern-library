import { useState, type ReactElement } from "react";
import { AppLayout } from "../../../app/layout/AppLayout";
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

      {booksState.showEmptyState ? (
        <BooksEmptyState onAdd={booksState.openAddModal} />
      ) : booksState.showNoResultsState ? (
        <BooksNoResultsState
          activeFilters={booksState.activeFilters}
          onAdd={booksState.openAddModal}
          onClearFilters={booksState.clearFilters}
          onClearSearch={booksState.clearSearch}
          search={booksState.search}
        />
      ) : (
        viewMode === "grid" ? (
          <BookGrid
            books={booksState.paginatedBooks}
            {...bookActionProps}
          />
        ) : (
          <BookList
            books={booksState.paginatedBooks}
            {...bookActionProps}
          />
        )
      )}

      <BooksPagination total={booksState.sortedBooks.length} />

      <BooksModalHost
        activeModal={booksState.activeModal}
        book={booksState.activeBook}
        onClose={booksState.closeModal}
        onOpenBookModal={booksState.openBookModal}
        onSubmit={booksState.submitModal}
      />
      <ToastNotification
        onClose={booksState.closeToast}
        toasts={booksState.toasts}
      />
    </AppLayout>
  );
}
