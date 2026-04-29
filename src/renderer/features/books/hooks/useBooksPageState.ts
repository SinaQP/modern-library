import { useMemo, useState } from "react";
import { mockBooks, noResultsFilters } from "../booksData";
import type {
  BookFilter,
  BookModalType,
  BookRecord,
  BookSortOption,
  ToastMessage,
  ToastVariant
} from "../types";

const pageSize = 8;
const persianCollator = new Intl.Collator("fa", { sensitivity: "base", numeric: true });

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

function compareCreatedAt(a: BookRecord, b: BookRecord): number {
  return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
}

function compareStatus(a: BookRecord, b: BookRecord, firstStatus: BookRecord["status"]): number {
  if (a.status === b.status) {
    return 0;
  }
  return a.status === firstStatus ? -1 : 1;
}

function sortBooks(books: BookRecord[], sortOption: BookSortOption): BookRecord[] {
  return [...books].sort((a, b) => {
    switch (sortOption) {
      case "oldest":
        return compareCreatedAt(a, b);
      case "title-asc":
        return persianCollator.compare(a.title, b.title);
      case "title-desc":
        return persianCollator.compare(b.title, a.title);
      case "author-asc":
        return persianCollator.compare(a.author, b.author);
      case "author-desc":
        return persianCollator.compare(b.author, a.author);
      case "publish-year-desc":
        return b.publishYear - a.publishYear;
      case "publish-year-asc":
        return a.publishYear - b.publishYear;
      case "status-available-first":
        return compareStatus(a, b, "available");
      case "status-loaned-first":
        return compareStatus(a, b, "loaned");
      case "newest":
      default:
        return compareCreatedAt(b, a);
    }
  });
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
  const [sortOption, setSortOption] = useState<BookSortOption>("newest");
  const [activeModal, setActiveModal] = useState<BookModalType | null>(routeConfig.initialModal);
  const [activeBookId, setActiveBookId] = useState<string | null>(null);
  const [savedBookIds, setSavedBookIds] = useState<Set<string>>(new Set());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const filteredBooks = useMemo(
    () => books.filter((book) => matchesSearch(book, search) && matchesFilter(book, activeFilters)),
    [activeFilters, books, search]
  );
  const sortedBooks = useMemo(
    () => sortBooks(filteredBooks, sortOption),
    [filteredBooks, sortOption]
  );
  const paginatedBooks = useMemo(() => sortedBooks.slice(0, pageSize), [sortedBooks]);

  const activeBook = books.find((book) => book.id === activeBookId);
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

  function showToastMessage(variant: ToastVariant, title: string, text: string) {
    setToasts((currentToasts) => [
      ...currentToasts,
      { id: Date.now() + Math.random(), text, title, variant }
    ]);
  }

  function showToast(variant: ToastVariant) {
    showToastMessage(variant, messageByVariant[variant].title, messageByVariant[variant].text);
  }

  function submitModal(variant: ToastVariant = "success") {
    setActiveModal(null);
    setActiveBookId(null);
    showToast(variant);
  }

  function closeModal() {
    setActiveModal(null);
    setActiveBookId(null);
  }

  function openAddModal() {
    setActiveBookId(null);
    setActiveModal("add");
  }

  function openBookModal(modal: Exclude<BookModalType, "add">, bookId: string) {
    setActiveBookId(bookId);
    setActiveModal(modal);
  }

  function toggleSavedBook(bookId: string) {
    const nextSavedBookIds = new Set(savedBookIds);
    const isSaved = nextSavedBookIds.has(bookId);

    if (isSaved) {
      nextSavedBookIds.delete(bookId);
      showToastMessage("info", "ذخیره‌ها", "کتاب از ذخیره‌ها حذف شد");
    } else {
      nextSavedBookIds.add(bookId);
      showToastMessage("success", "ذخیره‌ها", "کتاب ذخیره شد");
    }

    setSavedBookIds(nextSavedBookIds);
  }

  return {
    activeFilters,
    activeModal,
    activeBook,
    clearFilters: () => setActiveFilters(new Set()),
    clearSearch: () => setSearch(""),
    closeModal,
    closeToast: (toastId: number) =>
      setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== toastId)),
    filteredBooks,
    openAddModal,
    openBookModal,
    paginatedBooks,
    search,
    savedBookIds,
    setSearch,
    setSortOption,
    showEmptyState: books.length === 0 && !hasActiveSearchOrFilter,
    showNoResultsState: filteredBooks.length === 0 && hasActiveSearchOrFilter,
    sortOption,
    sortedBooks,
    submitModal,
    toasts,
    toggleSavedBook,
    toggleFilter
  };
}
