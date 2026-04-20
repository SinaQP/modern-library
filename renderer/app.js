const STATUS_AVAILABLE = "موجود";
const STATUS_BORROWED = "امانت داده شده";

const state = {
  books: [],
  selectedBookId: null,
  bookModalMode: "add",
  searchDebounceTimer: null,
  dialogResolver: null,
  overlayTimers: new Map()
};

const dom = {};

document.addEventListener("DOMContentLoaded", () => {
  cacheDom();
  bindEvents();
  updateActionButtons();
  setDefaultBorrowDate();
  refreshData();
});

function cacheDom() {
  dom.totalBooksValue = document.getElementById("totalBooksValue");
  dom.availableBooksValue = document.getElementById("availableBooksValue");
  dom.borrowedBooksValue = document.getElementById("borrowedBooksValue");
  dom.tableCountText = document.getElementById("tableCountText");

  dom.searchInput = document.getElementById("searchInput");
  dom.statusFilter = document.getElementById("statusFilter");

  dom.addBookBtn = document.getElementById("addBookBtn");
  dom.editBookBtn = document.getElementById("editBookBtn");
  dom.deleteBookBtn = document.getElementById("deleteBookBtn");
  dom.borrowBookBtn = document.getElementById("borrowBookBtn");
  dom.returnBookBtn = document.getElementById("returnBookBtn");
  dom.refreshBtn = document.getElementById("refreshBtn");

  dom.booksTable = document.getElementById("booksTable");
  dom.booksTableBody = document.getElementById("booksTableBody");
  dom.emptyState = document.getElementById("emptyState");

  dom.bookModalOverlay = document.getElementById("bookModalOverlay");
  dom.bookModalTitle = document.getElementById("bookModalTitle");
  dom.closeBookModalBtn = document.getElementById("closeBookModalBtn");
  dom.cancelBookModalBtn = document.getElementById("cancelBookModalBtn");
  dom.saveBookBtn = document.getElementById("saveBookBtn");
  dom.bookForm = document.getElementById("bookForm");
  dom.bookIdInput = document.getElementById("bookIdInput");
  dom.titleInput = document.getElementById("titleInput");
  dom.authorInput = document.getElementById("authorInput");
  dom.categoryInput = document.getElementById("categoryInput");
  dom.publishYearInput = document.getElementById("publishYearInput");
  dom.publisherInput = document.getElementById("publisherInput");
  dom.descriptionInput = document.getElementById("descriptionInput");

  dom.borrowModalOverlay = document.getElementById("borrowModalOverlay");
  dom.borrowForm = document.getElementById("borrowForm");
  dom.borrowBookIdInput = document.getElementById("borrowBookIdInput");
  dom.borrowBookName = document.getElementById("borrowBookName");
  dom.borrowerNameInput = document.getElementById("borrowerNameInput");
  dom.borrowDateInput = document.getElementById("borrowDateInput");
  dom.closeBorrowModalBtn = document.getElementById("closeBorrowModalBtn");
  dom.cancelBorrowModalBtn = document.getElementById("cancelBorrowModalBtn");

  dom.dialogOverlay = document.getElementById("dialogOverlay");
  dom.dialogIcon = document.getElementById("dialogIcon");
  dom.dialogTitle = document.getElementById("dialogTitle");
  dom.dialogMessage = document.getElementById("dialogMessage");
  dom.dialogCancelBtn = document.getElementById("dialogCancelBtn");
  dom.dialogConfirmBtn = document.getElementById("dialogConfirmBtn");

  dom.toastContainer = document.getElementById("toastContainer");
}

function bindEvents() {
  dom.searchInput.addEventListener("input", onSearchInput);
  dom.statusFilter.addEventListener("change", refreshData);

  dom.addBookBtn.addEventListener("click", openAddBookModal);
  dom.editBookBtn.addEventListener("click", openEditBookModal);
  dom.deleteBookBtn.addEventListener("click", onDeleteBook);
  dom.borrowBookBtn.addEventListener("click", openBorrowModalFromSelection);
  dom.returnBookBtn.addEventListener("click", onReturnBook);
  dom.refreshBtn.addEventListener("click", refreshData);

  dom.bookForm.addEventListener("submit", onSubmitBookForm);
  dom.borrowForm.addEventListener("submit", onSubmitBorrowForm);

  dom.closeBookModalBtn.addEventListener("click", () => closeOverlay(dom.bookModalOverlay));
  dom.cancelBookModalBtn.addEventListener("click", () => closeOverlay(dom.bookModalOverlay));
  dom.closeBorrowModalBtn.addEventListener("click", () => closeOverlay(dom.borrowModalOverlay));
  dom.cancelBorrowModalBtn.addEventListener("click", () => closeOverlay(dom.borrowModalOverlay));

  dom.bookModalOverlay.addEventListener("click", (event) => {
    if (event.target === dom.bookModalOverlay) {
      closeOverlay(dom.bookModalOverlay);
    }
  });

  dom.borrowModalOverlay.addEventListener("click", (event) => {
    if (event.target === dom.borrowModalOverlay) {
      closeOverlay(dom.borrowModalOverlay);
    }
  });

  dom.dialogConfirmBtn.addEventListener("click", () => resolveDialog(true));
  dom.dialogCancelBtn.addEventListener("click", () => resolveDialog(false));
  dom.dialogOverlay.addEventListener("click", (event) => {
    if (event.target !== dom.dialogOverlay) {
      return;
    }
    const canCancel = dom.dialogOverlay.dataset.cancelable === "yes";
    resolveDialog(!canCancel);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    if (isOverlayOpen(dom.dialogOverlay)) {
      const canCancel = dom.dialogOverlay.dataset.cancelable === "yes";
      resolveDialog(!canCancel);
      return;
    }

    if (isOverlayOpen(dom.borrowModalOverlay)) {
      closeOverlay(dom.borrowModalOverlay);
      return;
    }

    if (isOverlayOpen(dom.bookModalOverlay)) {
      closeOverlay(dom.bookModalOverlay);
    }
  });
}

async function refreshData() {
  try {
    const filters = {
      search: dom.searchInput.value || "",
      status: dom.statusFilter.value || "همه"
    };

    const [books, summary] = await Promise.all([
      window.libraryAPI.getBooks(filters),
      window.libraryAPI.getSummary()
    ]);

    state.books = books;

    if (!state.books.some((book) => book.id === state.selectedBookId)) {
      state.selectedBookId = null;
    }

    renderSummary(summary);
    renderTable();
    updateActionButtons();
  } catch (error) {
    await showDialog({
      title: "خطا در دریافت اطلاعات",
      message: getFriendlyError(error),
      type: "danger",
      confirmText: "متوجه شدم"
    });
  }
}

function renderSummary(summary) {
  dom.totalBooksValue.textContent = toPersianDigits(summary.total_books || 0);
  dom.availableBooksValue.textContent = toPersianDigits(summary.available_books || 0);
  dom.borrowedBooksValue.textContent = toPersianDigits(summary.borrowed_books || 0);
}

function renderTable() {
  dom.booksTableBody.innerHTML = "";

  const bookCountText = `${toPersianDigits(state.books.length)} کتاب در فهرست`;
  dom.tableCountText.textContent = bookCountText;

  if (state.books.length === 0) {
    dom.emptyState.classList.remove("hidden");
    return;
  }

  dom.emptyState.classList.add("hidden");

  state.books.forEach((book) => {
    const row = document.createElement("tr");
    row.dataset.id = String(book.id);

    if (state.selectedBookId === book.id) {
      row.classList.add("selected");
    }

    row.appendChild(createTextCell(book.title));
    row.appendChild(createTextCell(book.author));
    row.appendChild(createTextCell(book.category));
    row.appendChild(createTextCell(toPersianDigits(book.publish_year ?? "—")));
    row.appendChild(createTextCell(book.publisher));
    row.appendChild(createStatusCell(book.status));
    row.appendChild(createTextCell(book.borrower_name));
    row.appendChild(createTextCell(formatBorrowDate(book.borrow_date)));

    row.addEventListener("click", () => {
      state.selectedBookId = state.selectedBookId === book.id ? null : book.id;
      renderTable();
      updateActionButtons();
    });

    dom.booksTableBody.appendChild(row);
  });
}

function createTextCell(value) {
  const td = document.createElement("td");
  const span = document.createElement("span");
  span.className = "cell-text";

  const text = value === null || value === undefined || value === "" ? "—" : String(value);
  span.textContent = text;
  span.title = text;
  td.appendChild(span);

  return td;
}

function createStatusCell(status) {
  const td = document.createElement("td");
  const badge = document.createElement("span");
  const isAvailable = status === STATUS_AVAILABLE;
  badge.className = `status-badge ${isAvailable ? "status-available" : "status-borrowed"}`;
  badge.textContent = status;
  td.appendChild(badge);
  return td;
}

function updateActionButtons() {
  const selectedBook = getSelectedBook();
  const hasSelection = Boolean(selectedBook);

  dom.editBookBtn.disabled = !hasSelection;
  dom.deleteBookBtn.disabled = !hasSelection;
  dom.borrowBookBtn.disabled = !hasSelection || selectedBook.status !== STATUS_AVAILABLE;
  dom.returnBookBtn.disabled = !hasSelection || selectedBook.status !== STATUS_BORROWED;
}

function openAddBookModal() {
  state.bookModalMode = "add";
  dom.bookModalTitle.textContent = "افزودن کتاب جدید";
  dom.saveBookBtn.textContent = "ذخیره کتاب";
  dom.bookForm.reset();
  dom.bookIdInput.value = "";
  openOverlay(dom.bookModalOverlay);
  dom.titleInput.focus();
}

async function openEditBookModal() {
  const selectedBook = await requireSelection();
  if (!selectedBook) {
    return;
  }

  state.bookModalMode = "edit";
  dom.bookModalTitle.textContent = "ویرایش اطلاعات کتاب";
  dom.saveBookBtn.textContent = "ثبت تغییرات";

  dom.bookIdInput.value = String(selectedBook.id);
  dom.titleInput.value = selectedBook.title || "";
  dom.authorInput.value = selectedBook.author || "";
  dom.categoryInput.value = selectedBook.category || "";
  dom.publishYearInput.value = selectedBook.publish_year || "";
  dom.publisherInput.value = selectedBook.publisher || "";
  dom.descriptionInput.value = selectedBook.description || "";

  openOverlay(dom.bookModalOverlay);
  dom.titleInput.focus();
}

async function onSubmitBookForm(event) {
  event.preventDefault();

  const title = dom.titleInput.value.trim();
  const author = dom.authorInput.value.trim();
  const category = dom.categoryInput.value.trim();
  const publishYearRaw = dom.publishYearInput.value.trim();
  const publisher = dom.publisherInput.value.trim();
  const description = dom.descriptionInput.value.trim();

  if (!title) {
    await showDialog({
      title: "اعتبارسنجی اطلاعات",
      message: "وارد کردن عنوان کتاب الزامی است.",
      type: "warning",
      confirmText: "متوجه شدم"
    });
    dom.titleInput.focus();
    return;
  }

  if (!author) {
    await showDialog({
      title: "اعتبارسنجی اطلاعات",
      message: "وارد کردن نام نویسنده الزامی است.",
      type: "warning",
      confirmText: "متوجه شدم"
    });
    dom.authorInput.focus();
    return;
  }

  if (publishYearRaw) {
    const year = Number(publishYearRaw);
    if (!Number.isInteger(year) || year < 1000 || year > 2100) {
      await showDialog({
        title: "اعتبارسنجی اطلاعات",
        message: "سال انتشار باید عددی معتبر بین 1000 تا 2100 باشد.",
        type: "warning",
        confirmText: "متوجه شدم"
      });
      dom.publishYearInput.focus();
      return;
    }
  }

  const payload = {
    title,
    author,
    category,
    publish_year: publishYearRaw ? Number(publishYearRaw) : null,
    publisher,
    description
  };

  try {
    if (state.bookModalMode === "add") {
      await window.libraryAPI.addBook(payload);
      showToast("کتاب با موفقیت ثبت شد.", "success");
    } else {
      payload.id = Number(dom.bookIdInput.value);
      await window.libraryAPI.updateBook(payload);
      showToast("اطلاعات کتاب با موفقیت ویرایش شد.", "success");
    }

    closeOverlay(dom.bookModalOverlay);
    await refreshData();
  } catch (error) {
    await showDialog({
      title: "خطا در ثبت اطلاعات",
      message: getFriendlyError(error),
      type: "danger",
      confirmText: "متوجه شدم"
    });
  }
}

async function onDeleteBook() {
  const selectedBook = await requireSelection();
  if (!selectedBook) {
    return;
  }

  const confirmed = await showDialog({
    title: "تایید حذف کتاب",
    message: `آیا از حذف کتاب «${selectedBook.title}» مطمئن هستید؟`,
    type: "warning",
    confirmText: "حذف شود",
    cancelText: "انصراف",
    cancelable: true
  });

  if (!confirmed) {
    return;
  }

  try {
    await window.libraryAPI.deleteBook(selectedBook.id);
    state.selectedBookId = null;
    await refreshData();
    showToast("کتاب با موفقیت حذف شد.", "success");
  } catch (error) {
    await showDialog({
      title: "خطا در حذف کتاب",
      message: getFriendlyError(error),
      type: "danger",
      confirmText: "متوجه شدم"
    });
  }
}

async function openBorrowModalFromSelection() {
  const selectedBook = await requireSelection();
  if (!selectedBook) {
    return;
  }

  if (selectedBook.status !== STATUS_AVAILABLE) {
    await showDialog({
      title: "ثبت امانت",
      message: "این کتاب در حال حاضر موجود نیست و امکان ثبت امانت جدید ندارد.",
      type: "warning",
      confirmText: "متوجه شدم"
    });
    return;
  }

  dom.borrowForm.reset();
  setDefaultBorrowDate();
  dom.borrowBookIdInput.value = String(selectedBook.id);
  dom.borrowBookName.textContent = `کتاب انتخاب شده: ${selectedBook.title}`;

  openOverlay(dom.borrowModalOverlay);
  dom.borrowerNameInput.focus();
}

async function onSubmitBorrowForm(event) {
  event.preventDefault();

  const borrowerName = dom.borrowerNameInput.value.trim();
  const borrowDate = dom.borrowDateInput.value;
  const selectedBookId = Number(dom.borrowBookIdInput.value);

  if (!borrowerName) {
    await showDialog({
      title: "اعتبارسنجی اطلاعات",
      message: "وارد کردن نام امانت‌گیرنده الزامی است.",
      type: "warning",
      confirmText: "متوجه شدم"
    });
    dom.borrowerNameInput.focus();
    return;
  }

  if (!borrowDate) {
    await showDialog({
      title: "اعتبارسنجی اطلاعات",
      message: "تاریخ امانت را مشخص کنید.",
      type: "warning",
      confirmText: "متوجه شدم"
    });
    dom.borrowDateInput.focus();
    return;
  }

  try {
    await window.libraryAPI.borrowBook({
      id: selectedBookId,
      borrower_name: borrowerName,
      borrow_date: borrowDate
    });

    closeOverlay(dom.borrowModalOverlay);
    await refreshData();
    showToast("اطلاعات امانت با موفقیت ثبت شد.", "success");
  } catch (error) {
    await showDialog({
      title: "خطا در ثبت امانت",
      message: getFriendlyError(error),
      type: "danger",
      confirmText: "متوجه شدم"
    });
  }
}

async function onReturnBook() {
  const selectedBook = await requireSelection();
  if (!selectedBook) {
    return;
  }

  if (selectedBook.status !== STATUS_BORROWED) {
    await showDialog({
      title: "بازگردانی کتاب",
      message: "این کتاب در وضعیت امانت نیست.",
      type: "warning",
      confirmText: "متوجه شدم"
    });
    return;
  }

  const confirmed = await showDialog({
    title: "تایید بازگردانی",
    message: `بازگردانی کتاب «${selectedBook.title}» ثبت شود؟`,
    type: "info",
    confirmText: "ثبت بازگردانی",
    cancelText: "انصراف",
    cancelable: true
  });

  if (!confirmed) {
    return;
  }

  try {
    await window.libraryAPI.returnBook(selectedBook.id);
    await refreshData();
    showToast("کتاب با موفقیت بازگردانی شد.", "success");
  } catch (error) {
    await showDialog({
      title: "خطا در بازگردانی",
      message: getFriendlyError(error),
      type: "danger",
      confirmText: "متوجه شدم"
    });
  }
}

async function requireSelection() {
  const selectedBook = getSelectedBook();
  if (!selectedBook) {
    await showDialog({
      title: "انتخاب کتاب",
      message: "ابتدا یک ردیف از جدول کتاب‌ها را انتخاب کنید.",
      type: "warning",
      confirmText: "متوجه شدم"
    });
    return null;
  }
  return selectedBook;
}

function getSelectedBook() {
  return state.books.find((book) => book.id === state.selectedBookId) || null;
}

function onSearchInput() {
  clearTimeout(state.searchDebounceTimer);
  state.searchDebounceTimer = setTimeout(() => {
    refreshData();
  }, 250);
}

function openOverlay(overlay) {
  clearOverlayTimer(overlay);
  overlay.classList.remove("hidden");
  requestAnimationFrame(() => {
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
  });
}

function closeOverlay(overlay) {
  clearOverlayTimer(overlay);
  overlay.classList.remove("is-open");
  overlay.setAttribute("aria-hidden", "true");

  const timer = setTimeout(() => {
    overlay.classList.add("hidden");
    state.overlayTimers.delete(overlay);
  }, 180);

  state.overlayTimers.set(overlay, timer);
}

function clearOverlayTimer(overlay) {
  if (!state.overlayTimers.has(overlay)) {
    return;
  }

  clearTimeout(state.overlayTimers.get(overlay));
  state.overlayTimers.delete(overlay);
}

function isOverlayOpen(overlay) {
  return !overlay.classList.contains("hidden") && overlay.classList.contains("is-open");
}

function showDialog(options = {}) {
  return new Promise((resolve) => {
    if (state.dialogResolver) {
      const previousResolver = state.dialogResolver;
      state.dialogResolver = null;
      previousResolver(false);
    }

    const {
      title = "پیام",
      message = "",
      type = "info",
      confirmText = "باشه",
      cancelText = "انصراف",
      cancelable = false
    } = options;

    dom.dialogTitle.textContent = title;
    dom.dialogMessage.textContent = message;
    dom.dialogConfirmBtn.textContent = confirmText;
    dom.dialogCancelBtn.textContent = cancelText;
    dom.dialogOverlay.dataset.cancelable = cancelable ? "yes" : "no";
    dom.dialogCancelBtn.classList.toggle("hidden", !cancelable);

    if (type === "danger") {
      dom.dialogIcon.textContent = "×";
      dom.dialogIcon.style.background = "#ffe6ec";
      dom.dialogIcon.style.color = "#b33a53";
    } else if (type === "warning") {
      dom.dialogIcon.textContent = "!";
      dom.dialogIcon.style.background = "#fff1dc";
      dom.dialogIcon.style.color = "#b36f1f";
    } else {
      dom.dialogIcon.textContent = "i";
      dom.dialogIcon.style.background = "#e9f0ff";
      dom.dialogIcon.style.color = "#28529c";
    }

    state.dialogResolver = resolve;
    openOverlay(dom.dialogOverlay);
  });
}

function resolveDialog(result) {
  if (!state.dialogResolver) {
    return;
  }

  const resolver = state.dialogResolver;
  state.dialogResolver = null;
  closeOverlay(dom.dialogOverlay);
  resolver(result);
}

function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  dom.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(8px)";
    setTimeout(() => toast.remove(), 220);
  }, 2500);
}

function formatBorrowDate(value) {
  if (!value) {
    return "—";
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-");
    return `${toPersianDigits(year)}/${toPersianDigits(month)}/${toPersianDigits(day)}`;
  }

  return value;
}

function setDefaultBorrowDate() {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
  dom.borrowDateInput.value = localDate;
}

function toPersianDigits(value) {
  const digits = "۰۱۲۳۴۵۶۷۸۹";
  return String(value).replace(/\d/g, (digit) => digits[digit]);
}

function getFriendlyError(error) {
  const text = error?.message || "خطای ناشناخته رخ داده است.";
  const match = text.match(/Error invoking remote method '[^']+': (.+)$/);
  if (match && match[1]) {
    return match[1];
  }
  return text;
}
