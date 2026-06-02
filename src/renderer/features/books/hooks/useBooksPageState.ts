import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  addBook,
  deleteBook,
  fetchBooks,
  loanBook,
  returnBook,
  updateBook
} from "../services/booksService";
import type {
  BookFilter,
  BookFormValues,
  BookModalType,
  BookRecord,
  BookSortOption,
  LoanFormValues,
  ToastMessage,
  ToastVariant
} from "../types";

const pageSize = 8;
const toastDismissDelay = 5000;
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
    filterValue === "available" || filterValue === "loaned" ? filterValue : null;
  const initialModal: BookModalType | null = actionValue === "add" ? "add" : null;

  return { filter, initialModal, search };
}

function matchesFilter(book: BookRecord, filters: Set<BookFilter>): boolean {
  if (filters.size === 0) {
    return true;
  }

  return (
    (filters.has("available") && book.status === "available") ||
    (filters.has("loaned") && book.status === "loaned")
  );
}

function matchesSearch(book: BookRecord, search: string): boolean {
  const query = search.trim();
  if (!query) {
    return true;
  }

  return [book.title, book.author, book.category, book.publisher, book.isbn].some((value) =>
    (value ?? "").includes(query)
  );
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
    text: "فهرست کتاب‌ها به‌روز شد."
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
  const [books, setBooks] = useState<BookRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [isMutating, setIsMutating] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Set<BookFilter>>(
    routeConfig.filter ? new Set<BookFilter>([routeConfig.filter]) : new Set()
  );
  const [search, setSearch] = useState(routeConfig.search);
  const [sortOption, setSortOption] = useState<BookSortOption>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeModal, setActiveModal] = useState<BookModalType | null>(routeConfig.initialModal);
  const [activeBookId, setActiveBookId] = useState<number | null>(null);
  const [savedBookIds, setSavedBookIds] = useState<Set<number>>(new Set());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const toastTimers = useRef<Map<number, number>>(new Map());

  const loadBooks = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      setBooks(await fetchBooks());
    } catch (error) {
      const message = error instanceof Error ? error.message : "بارگذاری کتاب‌ها ناموفق بود.";
      setLoadError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBooks();
  }, [loadBooks]);

  useEffect(() => {
    return () => {
      toastTimers.current.forEach((timerId) => window.clearTimeout(timerId));
      toastTimers.current.clear();
    };
  }, []);

  const filteredBooks = useMemo(
    () => books.filter((book) => matchesSearch(book, search) && matchesFilter(book, activeFilters)),
    [activeFilters, books, search]
  );
  const sortedBooks = useMemo(
    () => sortBooks(filteredBooks, sortOption),
    [filteredBooks, sortOption]
  );
  const pageCount = Math.max(1, Math.ceil(sortedBooks.length / pageSize));
  const paginatedBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedBooks.slice(startIndex, startIndex + pageSize);
  }, [currentPage, sortedBooks]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilters, search, sortOption]);

  useEffect(() => {
    if (currentPage > pageCount) {
      setCurrentPage(pageCount);
    }
  }, [currentPage, pageCount]);

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

  const closeToast = useCallback((toastId: number) => {
    const timerId = toastTimers.current.get(toastId);
    if (timerId) {
      window.clearTimeout(timerId);
      toastTimers.current.delete(toastId);
    }

    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== toastId));
  }, []);

  function showToastMessage(variant: ToastVariant, title: string, text: string) {
    const toastId = Date.now() + Math.random();
    setToasts((currentToasts) => [
      ...currentToasts,
      { id: toastId, text, title, variant }
    ]);

    const timerId = window.setTimeout(() => closeToast(toastId), toastDismissDelay);
    toastTimers.current.set(toastId, timerId);
  }

  function showToast(variant: ToastVariant) {
    showToastMessage(variant, messageByVariant[variant].title, messageByVariant[variant].text);
  }

  async function runMutation(action: () => Promise<void>, variant: ToastVariant = "success") {
    setActionError("");
    setIsMutating(true);

    try {
      await action();
      await loadBooks();
      setActiveModal(null);
      setActiveBookId(null);
      showToast(variant);
    } catch (error) {
      const message = error instanceof Error ? error.message : "انجام عملیات ناموفق بود.";
      setActionError(message);
      showToastMessage("error", "خطا در انجام عملیات", message);
    } finally {
      setIsMutating(false);
    }
  }

  function closeModal() {
    setActiveModal(null);
    setActiveBookId(null);
  }

  function openAddModal() {
    setActiveBookId(null);
    setActiveModal("add");
  }

  function openBookModal(modal: Exclude<BookModalType, "add">, bookId: number) {
    setActiveBookId(bookId);
    setActiveModal(modal);
  }

  function submitAddBook(values: BookFormValues) {
    return runMutation(() => addBook(values), "success");
  }

  function submitEditBook(values: BookFormValues) {
    if (activeBookId === null) {
      return Promise.resolve();
    }

    return runMutation(() => updateBook(activeBookId, values), "success");
  }

  function submitLoanBook(values: LoanFormValues) {
    if (activeBookId === null) {
      return Promise.resolve();
    }

    return runMutation(() => loanBook(activeBookId, values), "success");
  }

  function submitReturnBook() {
    if (activeBookId === null) {
      return Promise.resolve();
    }

    return runMutation(() => returnBook(activeBookId), "info");
  }

  function submitDeleteBook() {
    if (activeBookId === null) {
      return Promise.resolve();
    }

    return runMutation(() => deleteBook(activeBookId), "success");
  }

  function toggleSavedBook(bookId: number) {
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
    actionError,
    clearFilters: () => setActiveFilters(new Set()),
    clearSearch: () => setSearch(""),
    closeModal,
    closeToast,
    currentPage,
    filteredBooks,
    isLoading,
    isMutating,
    loadError,
    openAddModal,
    openBookModal,
    paginatedBooks,
    pageCount,
    pageSize,
    refresh: loadBooks,
    search,
    savedBookIds,
    setSearch,
    setCurrentPage,
    setSortOption,
    showEmptyState: books.length === 0 && !hasActiveSearchOrFilter,
    showNoResultsState: filteredBooks.length === 0 && hasActiveSearchOrFilter,
    sortOption,
    sortedBooks,
    submitAddBook,
    submitDeleteBook,
    submitEditBook,
    submitLoanBook,
    submitReturnBook,
    toasts,
    toggleSavedBook,
    toggleFilter
  };
}
