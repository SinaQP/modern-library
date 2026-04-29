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
import { SelectionActionBar } from "./SelectionActionBar";
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
        onAdd={() => booksState.openModal("add")}
        onDelete={() => booksState.openModal("delete")}
        onEdit={() => booksState.openModal("edit")}
        onLoan={() => booksState.openModal("loan")}
        onReturn={() => booksState.openModal("return")}
        onSearchChange={booksState.setSearch}
        search={booksState.search}
        selectedCount={booksState.selectedBookIds.size}
      />

      <BooksFilterTabs
        activeFilters={booksState.activeFilters}
        onClearFilters={booksState.clearFilters}
        onToggleFilter={booksState.toggleFilter}
      />
      <BooksViewControls />

      <SelectionActionBar
        count={booksState.selectedBookIds.size}
        onClearSelection={booksState.clearSelection}
        onDelete={() => booksState.openModal("delete")}
        onEdit={() => booksState.openModal("edit")}
        onLoan={() => booksState.openModal("loan")}
        onReturn={() => booksState.openModal("return")}
      />

      {booksState.showEmptyState ? (
        <BooksEmptyState onAdd={() => booksState.openModal("add")} />
      ) : booksState.showNoResultsState ? (
        <BooksNoResultsState
          activeFilters={booksState.activeFilters}
          onAdd={() => booksState.openModal("add")}
          onClearFilters={booksState.clearFilters}
          onClearSearch={booksState.clearSearch}
          search={booksState.search}
        />
      ) : (
        <BookGrid
          books={booksState.filteredBooks}
          onToggleSelection={booksState.toggleSelection}
          selectedBookIds={booksState.selectedBookIds}
        />
      )}

      <BooksPagination total={booksState.filteredBooks.length} />

      <BooksModalHost
        activeModal={booksState.activeModal}
        book={booksState.selectedBook}
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
