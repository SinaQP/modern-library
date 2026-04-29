import type { ReactElement } from "react";
import { AppLayout } from "../../../app/layout/AppLayout";
import { BookGrid } from "./BookGrid";
import { BooksEmptyState } from "./BooksEmptyState";
import { BooksFilterTabs } from "./BooksFilterTabs";
import { BooksModalHost } from "./BooksModalHost";
import { BooksNoResultsState } from "./BooksNoResultsState";
import { BooksPagination } from "./BooksPagination";
import { BooksToolbar } from "./BooksToolbar";
import { BooksViewControls } from "./BooksViewControls";
import { ToastNotification } from "./ToastNotification";
import { useBooksPageState } from "../hooks/useBooksPageState";

type BooksPageProps = {
  routeState: string;
};

export function BooksPage({ routeState }: BooksPageProps): ReactElement {
  const booksState = useBooksPageState(routeState);

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
      <BooksViewControls />

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
        <BookGrid
          books={booksState.paginatedBooks}
          onDelete={(bookId) => booksState.openBookModal("delete", bookId)}
          onEdit={(bookId) => booksState.openBookModal("edit", bookId)}
          onLoan={(bookId) => booksState.openBookModal("loan", bookId)}
          onReturn={(bookId) => booksState.openBookModal("return", bookId)}
        />
      )}

      <BooksPagination total={booksState.sortedBooks.length} />

      <BooksModalHost
        activeModal={booksState.activeModal}
        book={booksState.activeBook}
        onClose={booksState.closeModal}
        onSubmit={booksState.submitModal}
      />
      <ToastNotification
        onClose={booksState.closeToast}
        toasts={booksState.toasts}
      />
    </AppLayout>
  );
}
