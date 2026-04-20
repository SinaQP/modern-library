const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

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
    throw new Error("شناسه کتاب معتبر نیست.");
  }
  return parsedId;
}

function normalizeYear(year) {
  if (year === undefined || year === null || year === "") {
    return null;
  }

  const parsedYear = Number(year);
  if (!Number.isInteger(parsedYear) || parsedYear < 1000 || parsedYear > 2100) {
    throw new Error("سال انتشار باید یک عدد معتبر بین 1000 تا 2100 باشد.");
  }

  return parsedYear;
}

function initializeDatabase(dbPath) {
  const dirPath = path.dirname(dbPath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  db = new Database(dbPath);
  db.pragma("journal_mode = WAL");

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
  const search = normalizePersianDigits(sanitizeText(filters.search));
  const allowedStatuses = new Set(["همه", STATUS_AVAILABLE, STATUS_BORROWED]);
  const statusCandidate = sanitizeText(filters.status);
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

  const title = sanitizeText(bookData.title);
  const author = sanitizeText(bookData.author);

  if (!title) {
    throw new Error("عنوان کتاب نمی‌تواند خالی باشد.");
  }

  if (!author) {
    throw new Error("نام نویسنده نمی‌تواند خالی باشد.");
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
    category: sanitizeText(bookData.category) || null,
    publish_year: normalizeYear(bookData.publish_year),
    publisher: sanitizeText(bookData.publisher) || null,
    description: sanitizeText(bookData.description) || null,
    status: STATUS_AVAILABLE
  });

  return {
    id: Number(result.lastInsertRowid)
  };
}

function updateBook(bookData = {}) {
  ensureDatabase();
  const id = normalizeId(bookData.id);
  const title = sanitizeText(bookData.title);
  const author = sanitizeText(bookData.author);

  if (!title) {
    throw new Error("عنوان کتاب نمی‌تواند خالی باشد.");
  }

  if (!author) {
    throw new Error("نام نویسنده نمی‌تواند خالی باشد.");
  }

  const targetBook = db.prepare("SELECT id FROM books WHERE id = ?").get(id);
  if (!targetBook) {
    throw new Error("کتاب مورد نظر پیدا نشد.");
  }

  db.prepare(`
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
    category: sanitizeText(bookData.category) || null,
    publish_year: normalizeYear(bookData.publish_year),
    publisher: sanitizeText(bookData.publisher) || null,
    description: sanitizeText(bookData.description) || null
  });

  return { id, updated: true };
}

function deleteBook(id) {
  ensureDatabase();
  const normalizedId = normalizeId(id);
  const result = db.prepare("DELETE FROM books WHERE id = ?").run(normalizedId);

  if (result.changes === 0) {
    throw new Error("کتاب مورد نظر برای حذف پیدا نشد.");
  }

  return { deleted: true };
}

function borrowBook(payload = {}) {
  ensureDatabase();
  const id = normalizeId(payload.id);
  const borrowerName = sanitizeText(payload.borrower_name);
  const borrowDate = sanitizeText(payload.borrow_date);

  if (!borrowerName) {
    throw new Error("نام امانت‌گیرنده الزامی است.");
  }

  if (!borrowDate) {
    throw new Error("تاریخ امانت الزامی است.");
  }

  const targetBook = db
    .prepare("SELECT id, status FROM books WHERE id = ?")
    .get(id);

  if (!targetBook) {
    throw new Error("کتاب مورد نظر پیدا نشد.");
  }

  if (targetBook.status === STATUS_BORROWED) {
    throw new Error("این کتاب در حال حاضر امانت داده شده است.");
  }

  db.prepare(`
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

  return { id, borrowed: true };
}

function returnBook(id) {
  ensureDatabase();
  const normalizedId = normalizeId(id);
  const targetBook = db
    .prepare("SELECT id, status FROM books WHERE id = ?")
    .get(normalizedId);

  if (!targetBook) {
    throw new Error("کتاب مورد نظر پیدا نشد.");
  }

  if (targetBook.status !== STATUS_BORROWED) {
    throw new Error("این کتاب در حال حاضر در وضعیت موجود است.");
  }

  db.prepare(`
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
