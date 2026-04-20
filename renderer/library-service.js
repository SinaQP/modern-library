(function exposeLibraryService() {
  function getApi() {
    if (!window.libraryAPI) {
      throw new Error("Library API is not available.");
    }
    return window.libraryAPI;
  }

  function sanitizeText(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  function toNullableText(value) {
    const text = sanitizeText(value);
    return text || "";
  }

  function normalizeId(id, errorMessage) {
    const parsed = Number(id);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      throw new Error(errorMessage || "Invalid book id.");
    }
    return parsed;
  }

  function normalizePublishYear(year) {
    if (year === undefined || year === null || year === "") {
      return null;
    }

    const parsed = Number(year);
    if (!Number.isInteger(parsed) || parsed < 1000 || parsed > 2100) {
      throw new Error("Publish year must be a valid integer between 1000 and 2100.");
    }

    return parsed;
  }

  function normalizeBorrowDate(rawDate) {
    const date = sanitizeText(rawDate);
    if (!date) {
      throw new Error("Borrow date is required.");
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error("Borrow date must be in YYYY-MM-DD format.");
    }

    return date;
  }

  function normalizeFilters(filters = {}) {
    const normalized = {
      search: sanitizeText(filters.search),
      status: sanitizeText(filters.status)
    };

    if (!normalized.status) {
      delete normalized.status;
    }

    return normalized;
  }

  function normalizeSummary(summary = {}) {
    return {
      total_books: Number(summary.total_books || 0),
      available_books: Number(summary.available_books || 0),
      borrowed_books: Number(summary.borrowed_books || 0)
    };
  }

  function normalizeBookPayload(payload = {}) {
    const normalized = {
      title: sanitizeText(payload.title),
      author: sanitizeText(payload.author),
      category: toNullableText(payload.category),
      publish_year: normalizePublishYear(payload.publish_year),
      publisher: toNullableText(payload.publisher),
      description: toNullableText(payload.description)
    };

    if (!normalized.title) {
      throw new Error("Book title is required.");
    }

    if (!normalized.author) {
      throw new Error("Author name is required.");
    }

    return normalized;
  }

  const libraryService = {
    async fetchLibraryData(filters = {}) {
      const api = getApi();
      const normalizedFilters = normalizeFilters(filters);

      const [books, summary] = await Promise.all([
        api.getBooks(normalizedFilters),
        api.getSummary()
      ]);

      return {
        books: Array.isArray(books) ? books : [],
        summary: normalizeSummary(summary)
      };
    },

    addBook(payload = {}) {
      const api = getApi();
      return api.addBook(normalizeBookPayload(payload));
    },

    updateBook(payload = {}) {
      const api = getApi();
      return api.updateBook({
        id: normalizeId(payload.id, "Book id is required for update."),
        ...normalizeBookPayload(payload)
      });
    },

    deleteBook(id) {
      const api = getApi();
      return api.deleteBook(normalizeId(id, "Book id is required for delete."));
    },

    borrowBook(payload = {}) {
      const api = getApi();
      const borrowerName = sanitizeText(payload.borrower_name);

      if (!borrowerName) {
        throw new Error("Borrower name is required.");
      }

      if (borrowerName.length < 3) {
        throw new Error("Borrower name must be at least 3 characters.");
      }

      return api.borrowBook({
        id: normalizeId(payload.id, "Book id is required for borrow."),
        borrower_name: borrowerName,
        borrow_date: normalizeBorrowDate(payload.borrow_date)
      });
    },

    returnBook(id) {
      const api = getApi();
      return api.returnBook(normalizeId(id, "Book id is required for return."));
    }
  };

  window.libraryService = Object.freeze(libraryService);
})();
