import type {
  BookFilters,
  BookMutationResult,
  BookRecord,
  CreateBookPayload,
  LibraryDashboardData,
  LibrarySummary
} from "../types";

function getApi() {
  if (!window.libraryAPI) {
    throw new Error("Library API is not available.");
  }

  return window.libraryAPI;
}

function normalizeSummary(summary: Partial<LibrarySummary> = {}): LibrarySummary {
  return {
    total_books: Number(summary.total_books || 0),
    available_books: Number(summary.available_books || 0),
    borrowed_books: Number(summary.borrowed_books || 0)
  };
}

function normalizeBooks(books: unknown): BookRecord[] {
  return Array.isArray(books) ? books : [];
}

function toFriendlyError(error: unknown): Error {
  if (error instanceof Error && error.message) {
    return new Error(error.message);
  }

  return new Error("Unable to complete the request.");
}

export async function loadLibraryDashboard(
  filters: BookFilters
): Promise<LibraryDashboardData> {
  try {
    const api = getApi();
    const [books, summary] = await Promise.all([
      api.getBooks(filters),
      api.getSummary()
    ]);

    return {
      books: normalizeBooks(books),
      summary: normalizeSummary(summary)
    };
  } catch (error) {
    throw toFriendlyError(error);
  }
}

export async function createBook(payload: CreateBookPayload): Promise<BookMutationResult> {
  try {
    return await getApi().addBook(payload);
  } catch (error) {
    throw toFriendlyError(error);
  }
}

export async function returnBorrowedBook(id: number): Promise<BookMutationResult> {
  try {
    return await getApi().returnBook(id);
  } catch (error) {
    throw toFriendlyError(error);
  }
}
