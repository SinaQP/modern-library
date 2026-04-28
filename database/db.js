const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");
const { createUserFacingError } = require("../shared/errors");

const STATUS_AVAILABLE = "موجود";
const STATUS_BORROWED = "امانت داده شده";

let db = null;

function ensureDatabase() {
  if (!db) {
    throw new Error("اتصال به دیتابیس برقرار نیست.");
  }
}

function sanitizeText(value) {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
}

function normalizePersianDigits(value) {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
}

function normalizeId(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    throw createUserFacingError("شناسه کتاب معتبر نیست.");
  }
  return parsedId;
}

function normalizeYear(year) {
  if (year === undefined || year === null || year === "") {
    return null;
  }

  const parsedYear = Number(year);
  if (!Number.isInteger(parsedYear) || parsedYear < 1000 || parsedYear > 2100) {
    throw createUserFacingError("سال انتشار باید یک عدد معتبر بین 1000 تا 2100 باشد.");
  }

  return parsedYear;
}

function normalizeBorrowDate(value) {
  const borrowDate = sanitizeText(value);
  if (!borrowDate) {
    throw createUserFacingError("Borrow date is required.");
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(borrowDate)) {
    throw createUserFacingError("Borrow date must be in YYYY-MM-DD format.");
  }

  return borrowDate;
}

function normalizeBorrowerName(value) {
  const borrowerName = sanitizeText(value);
  if (!borrowerName) {
    throw createUserFacingError("Borrower name is required.");
  }

  if (borrowerName.length < 3) {
    throw createUserFacingError("Borrower name must be at least 3 characters.");
  }

  return borrowerName;
}

function ensureObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }
  return value;
}

function toNullableText(value) {
  const text = sanitizeText(value);
  return text || null;
}

function initializeDatabase(dbPath) {
  if (db) {
    db.close();
    db = null;
  }

  const dirPath = path.dirname(dbPath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("busy_timeout = 5000");

  db.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      category TEXT,
      publish_year INTEGER,
      publisher TEXT,
      description TEXT,
      status TEXT DEFAULT 'موجود',
      borrower_name TEXT,
      borrow_date TEXT
    )
  `);
}

function getBooks(filters = {}) {
  ensureDatabase();
  const normalizedFilters = ensureObject(filters);
  const search = normalizePersianDigits(sanitizeText(normalizedFilters.search));
  const allowedStatuses = new Set(["همه", STATUS_AVAILABLE, STATUS_BORROWED]);
  const statusCandidate = sanitizeText(normalizedFilters.status);
  const status = allowedStatuses.has(statusCandidate) ? statusCandidate : "همه";
  const likePattern = `%${search}%`;

  const statement = db.prepare(`
    SELECT
      id,
      title,
      author,
      category,
      publish_year,
      publisher,
      description,
      status,
      borrower_name,
      borrow_date
    FROM books
    WHERE
      (@search = '' OR
        title LIKE @likePattern OR
        author LIKE @likePattern OR
        category LIKE @likePattern OR
        publisher LIKE @likePattern OR
        CAST(publish_year AS TEXT) LIKE @likePattern
      )
      AND (@status = 'همه' OR status = @status)
    ORDER BY id DESC
  `);

  return statement.all({ search, likePattern, status });
}

function getSummary() {
  ensureDatabase();
  const row = db
    .prepare(`
      SELECT
        COUNT(*) AS total_books,
        SUM(CASE WHEN status = @availableStatus THEN 1 ELSE 0 END) AS available_books,
        SUM(CASE WHEN status = @borrowedStatus THEN 1 ELSE 0 END) AS borrowed_books
      FROM books
    `)
    .get({
      availableStatus: STATUS_AVAILABLE,
      borrowedStatus: STATUS_BORROWED
    });

  return {
    total_books: Number(row.total_books || 0),
    available_books: Number(row.available_books || 0),
    borrowed_books: Number(row.borrowed_books || 0)
  };
}

function addBook(bookData = {}) {
  ensureDatabase();
  const payload = ensureObject(bookData);

  const title = sanitizeText(payload.title);
  const author = sanitizeText(payload.author);

  if (!title) {
    throw createUserFacingError("عنوان کتاب نمی‌تواند خالی باشد.");
  }

  if (!author) {
    throw createUserFacingError("نام نویسنده نمی‌تواند خالی باشد.");
  }

  const insertStatement = db.prepare(`
    INSERT INTO books (
      title,
      author,
      category,
      publish_year,
      publisher,
      description,
      status,
      borrower_name,
      borrow_date
    )
    VALUES (
      @title,
      @author,
      @category,
      @publish_year,
      @publisher,
      @description,
      @status,
      NULL,
      NULL
    )
  `);

  const result = insertStatement.run({
    title,
    author,
    category: toNullableText(payload.category),
    publish_year: normalizeYear(payload.publish_year),
    publisher: toNullableText(payload.publisher),
    description: toNullableText(payload.description),
    status: STATUS_AVAILABLE
  });

  if (result.changes !== 1) {
    throw new Error("Book insert failed.");
  }

  return {
    id: Number(result.lastInsertRowid)
  };
}

function updateBook(bookData = {}) {
  ensureDatabase();
  const payload = ensureObject(bookData);
  const id = normalizeId(payload.id);
  const title = sanitizeText(payload.title);
  const author = sanitizeText(payload.author);

  if (!title) {
    throw createUserFacingError("عنوان کتاب نمی‌تواند خالی باشد.");
  }

  if (!author) {
    throw createUserFacingError("نام نویسنده نمی‌تواند خالی باشد.");
  }

  const targetBook = db.prepare("SELECT id FROM books WHERE id = ?").get(id);
  if (!targetBook) {
    throw createUserFacingError("کتاب مورد نظر پیدا نشد.");
  }

  const result = db.prepare(`
    UPDATE books
    SET
      title = @title,
      author = @author,
      category = @category,
      publish_year = @publish_year,
      publisher = @publisher,
      description = @description
    WHERE id = @id
  `).run({
    id,
    title,
    author,
    category: toNullableText(payload.category),
    publish_year: normalizeYear(payload.publish_year),
    publisher: toNullableText(payload.publisher),
    description: toNullableText(payload.description)
  });

  if (result.changes !== 1) {
    throw new Error("Book update failed.");
  }

  return { id, updated: true };
}

function deleteBook(id) {
  ensureDatabase();
  const normalizedId = normalizeId(id);
  const result = db.prepare("DELETE FROM books WHERE id = ?").run(normalizedId);

  if (result.changes === 0) {
    throw createUserFacingError("کتاب مورد نظر برای حذف پیدا نشد.");
  }

  return { deleted: true };
}

function borrowBook(payload = {}) {
  ensureDatabase();
  const normalizedPayload = ensureObject(payload);
  const id = normalizeId(normalizedPayload.id);
  const borrowerName = normalizeBorrowerName(normalizedPayload.borrower_name);
  const borrowDate = normalizeBorrowDate(normalizedPayload.borrow_date);

  const runBorrow = db.transaction(() => {
    const targetBook = db
      .prepare("SELECT id, status FROM books WHERE id = ?")
      .get(id);

    if (!targetBook) {
      throw createUserFacingError("Book not found.");
    }

    if (targetBook.status === STATUS_BORROWED) {
      throw createUserFacingError("This book is already borrowed.");
    }

    const result = db.prepare(`
      UPDATE books
      SET
        status = @status,
        borrower_name = @borrower_name,
        borrow_date = @borrow_date
      WHERE id = @id
    `).run({
      id,
      status: STATUS_BORROWED,
      borrower_name: borrowerName,
      borrow_date: borrowDate
    });

    if (result.changes !== 1) {
      throw new Error("Borrow operation failed.");
    }
  });

  runBorrow();
  return { id, borrowed: true };
}

function returnBook(id) {
  ensureDatabase();
  const normalizedId = normalizeId(id);

  const runReturn = db.transaction(() => {
    const targetBook = db
      .prepare("SELECT id, status FROM books WHERE id = ?")
      .get(normalizedId);

    if (!targetBook) {
      throw createUserFacingError("Book not found.");
    }

    if (targetBook.status !== STATUS_BORROWED) {
      throw createUserFacingError("Only borrowed books can be returned.");
    }

    const result = db.prepare(`
      UPDATE books
      SET
        status = @status,
        borrower_name = NULL,
        borrow_date = NULL
      WHERE id = @id
    `).run({
      id: normalizedId,
      status: STATUS_AVAILABLE
    });

    if (result.changes !== 1) {
      throw new Error("Return operation failed.");
    }
  });

  runReturn();
  return { id: normalizedId, returned: true };
}

function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}

module.exports = {
  initializeDatabase,
  getBooks,
  getSummary,
  addBook,
  updateBook,
  deleteBook,
  borrowBook,
  returnBook,
  closeDatabase
};


