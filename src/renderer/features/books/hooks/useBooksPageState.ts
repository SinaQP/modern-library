import { useMemo, useState } from "react";
import { initialSelectedBookIds, mockBooks, noResultsFilters } from "../booksData";
import type { BookFilter, BookModalType, BookRecord, ToastMessage, ToastVariant } from "../types";

function parseBooksRouteState(routeState: string): {
  filter: BookFilter | null;
  initialModal: BookModalType | null;
  search: string;
} {
  const [hashPath, hashQuery = ""] = routeState.split("?");
  const isBooksRoute = hashPath.startsWith("#books");
  const params = new URLSearchParams(hashQuery);
  const search = isBooksRoute ? (params.get("search") ?? "").trim() : "";
  const filterValue = isBooksRoute ? params.get("filter") : null;
  const actionValue = isBooksRoute ? params.get("action") : null;

  const filter: BookFilter | null =
    filterValue === "available" || filterValue === "loaned" || filterValue === "overdue"
      ? filterValue
      : null;
  const initialModal: BookModalType | null = actionValue === "add" ? "add" : null;

  return { filter, initialModal, search };
}

function matchesFilter(book: BookRecord, filters: Set<BookFilter>): boolean {
  if (filters.size === 0) {
    return true;
  }

  return (
    (filters.has("available") && book.status === "available") ||
    (filters.has("loaned") && book.status === "loaned") ||
    (filters.has("overdue") && book.id === "book-4")
  );
}

function matchesSearch(book: BookRecord, search: string): boolean {
  const query = search.trim();
  if (!query) {
    return true;
  }

  return [book.title, book.author, book.category, book.isbn].some((value) => value.includes(query));
}

const messageByVariant = {
  success: {
    title: "عملیات با موفقیت انجام شد",
    text: "کتاب با موفقیت به کتابخانه اضافه شد."
  },
  error: {
    title: "خطا در انجام عملیات",
    text: "اطلاعات وارد شده صحیح نیست، لطفا بررسی کنید."
  },
  info: {
    title: "کتاب بازگردانده شد",
    text: "بازگردانی کتاب با موفقیت ثبت شد."
  }
};

export function useBooksPageState(routeState: string) {
  const routeConfig = parseBooksRouteState(routeState);
  const isEmptyRoute = routeState.includes("empty");
  const isNoResultsRoute = routeState.includes("no-results");
  const [books] = useState<BookRecord[]>(isEmptyRoute ? [] : mockBooks);
  const [activeFilters, setActiveFilters] = useState<Set<BookFilter>>(
    isNoResultsRoute
      ? new Set(noResultsFilters)
      : routeConfig.filter
        ? new Set<BookFilter>([routeConfig.filter])
        : new Set()
  );
  const [search, setSearch] = useState(routeConfig.search || (isNoResultsRoute ? "دیوان حافظ" : ""));
  const [selectedBookIds, setSelectedBookIds] = useState<Set<string>>(
    isEmptyRoute || isNoResultsRoute ? new Set() : new Set(initialSelectedBookIds)
  );
  const [activeModal, setActiveModal] = useState<BookModalType | null>(routeConfig.initialModal);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const filteredBooks = useMemo(
    () => books.filter((book) => matchesSearch(book, search) && matchesFilter(book, activeFilters)),
    [activeFilters, books, search]
  );

  const selectedBook =
    books.find((book) => selectedBookIds.has(book.id)) ??
    books.find((book) => book.status === "loaned") ??
    books[0];
  const hasActiveSearchOrFilter = Boolean(search.trim()) || activeFilters.size > 0;

  function toggleFilter(filter: BookFilter) {
    setActiveFilters((currentFilters) => {
      const nextFilters = new Set(currentFilters);
      if (nextFilters.has(filter)) {
        nextFilters.delete(filter);
      } else {
        nextFilters.add(filter);
      }
      return nextFilters;
    });
  }

  function toggleSelection(bookId: string) {
    setSelectedBookIds((currentSelection) => {
      const nextSelection = new Set(currentSelection);
      if (nextSelection.has(bookId)) {
        nextSelection.delete(bookId);
      } else {
        nextSelection.add(bookId);
      }
      return nextSelection;
    });
  }

  function showToast(variant: ToastVariant) {
    setToasts((currentToasts) => [
      ...currentToasts,
      { id: Date.now(), variant, ...messageByVariant[variant] }
    ]);
  }

  function submitModal(variant: ToastVariant = "success") {
    setActiveModal(null);
    showToast(variant);
  }

  return {
    activeFilters,
    activeModal,
    clearFilters: () => setActiveFilters(new Set()),
    clearSearch: () => setSearch(""),
    clearSelection: () => setSelectedBookIds(new Set()),
    closeModal: () => setActiveModal(null),
    closeToast: (toastId: number) =>
      setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== toastId)),
    filteredBooks,
    openModal: setActiveModal,
    search,
    selectedBook,
    selectedBookIds,
    setSearch,
    showEmptyState: books.length === 0 && !hasActiveSearchOrFilter,
    showNoResultsState: filteredBooks.length === 0 && hasActiveSearchOrFilter,
    submitModal,
    toasts,
    toggleFilter,
    toggleSelection
  };
}
