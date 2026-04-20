const STATUS_AVAILABLE = "موجود";
const STATUS_BORROWED = "امانت داده شده";
const OVERLAY_CLOSE_MS = 280;

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
  bindFormFieldValidation();
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
  dom.bookFormNotice = document.getElementById("bookFormNotice");
  dom.bookIdInput = document.getElementById("bookIdInput");
  dom.titleInput = document.getElementById("titleInput");
  dom.authorInput = document.getElementById("authorInput");
  dom.categoryInput = document.getElementById("categoryInput");
  dom.publishYearInput = document.getElementById("publishYearInput");
  dom.publisherInput = document.getElementById("publisherInput");
  dom.descriptionInput = document.getElementById("descriptionInput");

  dom.borrowModalOverlay = document.getElementById("borrowModalOverlay");
  dom.borrowForm = document.getElementById("borrowForm");
  dom.borrowFormNotice = document.getElementById("borrowFormNotice");
  dom.borrowBookIdInput = document.getElementById("borrowBookIdInput");
  dom.borrowBookName = document.getElementById("borrowBookName");
  dom.borrowerNameInput = document.getElementById("borrowerNameInput");
  dom.borrowDateInput = document.getElementById("borrowDateInput");
  dom.closeBorrowModalBtn = document.getElementById("closeBorrowModalBtn");
  dom.cancelBorrowModalBtn = document.getElementById("cancelBorrowModalBtn");

  dom.dialogOverlay = document.getElementById("dialogOverlay");
  dom.dialogCard = dom.dialogOverlay.querySelector(".dialog-card");
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

function bindFormFieldValidation() {
  bindFieldValidation(dom.titleInput, () => {
    if (!dom.titleInput.value.trim()) {
      return "عنوان کتاب را وارد کنید.";
    }
    return "";
  });

  bindFieldValidation(dom.authorInput, () => {
    if (!dom.authorInput.value.trim()) {
      return "نام نویسنده الزامی است.";
    }
    return "";
  });

  bindFieldValidation(dom.publishYearInput, () => validatePublishYear(dom.publishYearInput.value.trim()));

  bindFieldValidation(dom.borrowerNameInput, () => {
    const value = dom.borrowerNameInput.value.trim();
    if (!value) {
      return "نام امانت‌گیرنده را وارد کنید.";
    }
    if (value.length < 3) {
      return "نام امانت‌گیرنده باید حداقل ۳ کاراکتر باشد.";
    }
    return "";
  });

  bindFieldValidation(dom.borrowDateInput, () => {
    if (!dom.borrowDateInput.value) {
      return "تاریخ امانت را مشخص کنید.";
    }
    return "";
  });
}

function bindFieldValidation(input, validator) {
  if (!input || typeof validator !== "function") {
    return;
  }

  input.addEventListener("input", () => {
    clearFormNotice(input.form === dom.bookForm ? dom.bookFormNotice : dom.borrowFormNotice);
    const message = validator();
    if (message) {
      setFieldError(input, message);
      return;
    }
    setFieldValid(input);
  });

  input.addEventListener("blur", () => {
    const message = validator();
    if (message) {
      setFieldError(input, message);
      return;
    }
    setFieldValid(input);
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

  dom.tableCountText.textContent = `${toPersianDigits(state.books.length)} کتاب ثبت‌شده`;

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
  clearFormValidation(dom.bookForm, dom.bookFormNotice);
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

  clearFormValidation(dom.bookForm, dom.bookFormNotice);
  openOverlay(dom.bookModalOverlay);
  dom.titleInput.focus();
}

async function onSubmitBookForm(event) {
  event.preventDefault();

  clearFormValidation(dom.bookForm, dom.bookFormNotice);

  const title = dom.titleInput.value.trim();
  const author = dom.authorInput.value.trim();
  const category = dom.categoryInput.value.trim();
  const publishYearRaw = dom.publishYearInput.value.trim();
  const publisher = dom.publisherInput.value.trim();
  const description = dom.descriptionInput.value.trim();

  const errors = [];

  if (!title) {
    errors.push({ input: dom.titleInput, message: "عنوان کتاب را وارد کنید." });
  }

  if (!author) {
    errors.push({ input: dom.authorInput, message: "نام نویسنده را وارد کنید." });
  }

  const yearError = validatePublishYear(publishYearRaw);
  if (yearError) {
    errors.push({ input: dom.publishYearInput, message: yearError });
  }

  if (errors.length > 0) {
    errors.forEach(({ input, message }) => setFieldError(input, message));
    showFormNotice(dom.bookFormNotice, "لطفا خطاهای مشخص‌شده را اصلاح کنید و دوباره تلاش کنید.", "error");
    const firstInput = errors[0]?.input;
    if (firstInput) {
      firstInput.focus();
    }
    showToast({
      type: "warning",
      title: "نیاز به اصلاح فرم",
      message: "پیش از ذخیره، موارد الزامی را کامل کنید."
    });
    return;
  }

  [dom.titleInput, dom.authorInput, dom.publishYearInput]
    .filter((input) => input.value.trim())
    .forEach(setFieldValid);

  const payload = {
    title,
    author,
    category,
    publish_year: publishYearRaw ? Number(publishYearRaw) : null,
    publisher,
    description
  };

  const defaultSubmitText = dom.saveBookBtn.textContent;
  setButtonBusy(dom.saveBookBtn, true, state.bookModalMode === "add" ? "در حال ذخیره..." : "در حال ثبت تغییرات...");

  try {
    if (state.bookModalMode === "add") {
      await window.libraryAPI.addBook(payload);
      showToast({
        type: "success",
        title: "ثبت موفق",
        message: "کتاب جدید با موفقیت به کتابخانه اضافه شد."
      });
    } else {
      payload.id = Number(dom.bookIdInput.value);
      await window.libraryAPI.updateBook(payload);
      showToast({
        type: "success",
        title: "ویرایش موفق",
        message: "اطلاعات کتاب با موفقیت به‌روزرسانی شد."
      });
    }

    closeOverlay(dom.bookModalOverlay);
    await refreshData();
  } catch (error) {
    showFormNotice(dom.bookFormNotice, "ثبت اطلاعات انجام نشد. لطفا دوباره تلاش کنید.", "error");
    await showDialog({
      title: "خطا در ثبت اطلاعات",
      message: getFriendlyError(error),
      type: "danger",
      confirmText: "متوجه شدم"
    });
  } finally {
    setButtonBusy(dom.saveBookBtn, false, defaultSubmitText);
  }
}

async function onDeleteBook() {
  const selectedBook = await requireSelection();
  if (!selectedBook) {
    return;
  }

  const confirmed = await showDialog({
    title: "تایید حذف کتاب",
    message: `آیا از حذف کتاب «${selectedBook.title}» مطمئن هستید؟ این عملیات قابل بازگشت نیست.`,
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
    showToast({
      type: "success",
      title: "حذف انجام شد",
      message: "کتاب انتخاب‌شده از فهرست حذف شد."
    });
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
      title: "امکان ثبت امانت وجود ندارد",
      message: "این کتاب هم‌اکنون در وضعیت امانت است و نمی‌توان امانت جدید ثبت کرد.",
      type: "warning",
      confirmText: "متوجه شدم"
    });
    return;
  }

  dom.borrowForm.reset();
  clearFormValidation(dom.borrowForm, dom.borrowFormNotice);
  setDefaultBorrowDate();
  dom.borrowBookIdInput.value = String(selectedBook.id);
  dom.borrowBookName.textContent = `کتاب انتخاب‌شده: «${selectedBook.title}»`;

  openOverlay(dom.borrowModalOverlay);
  dom.borrowerNameInput.focus();
}

async function onSubmitBorrowForm(event) {
  event.preventDefault();

  clearFormValidation(dom.borrowForm, dom.borrowFormNotice);

  const borrowerName = dom.borrowerNameInput.value.trim();
  const borrowDate = dom.borrowDateInput.value;
  const selectedBookId = Number(dom.borrowBookIdInput.value);

  const errors = [];

  if (!borrowerName) {
    errors.push({ input: dom.borrowerNameInput, message: "نام امانت‌گیرنده را وارد کنید." });
  } else if (borrowerName.length < 3) {
    errors.push({ input: dom.borrowerNameInput, message: "نام امانت‌گیرنده باید حداقل ۳ کاراکتر باشد." });
  }

  if (!borrowDate) {
    errors.push({ input: dom.borrowDateInput, message: "تاریخ امانت را مشخص کنید." });
  }

  if (errors.length > 0) {
    errors.forEach(({ input, message }) => setFieldError(input, message));
    showFormNotice(dom.borrowFormNotice, "برای ثبت امانت، تکمیل تمام فیلدهای الزامی ضروری است.", "error");
    const firstInput = errors[0]?.input;
    if (firstInput) {
      firstInput.focus();
    }
    showToast({
      type: "warning",
      title: "فرم ناقص است",
      message: "لطفا اطلاعات امانت را کامل کنید."
    });
    return;
  }

  setFieldValid(dom.borrowerNameInput);
  setFieldValid(dom.borrowDateInput);

  const submitBtn = dom.borrowForm.querySelector('button[type="submit"]');
  const defaultSubmitText = submitBtn.textContent;
  setButtonBusy(submitBtn, true, "در حال ثبت...");

  try {
    await window.libraryAPI.borrowBook({
      id: selectedBookId,
      borrower_name: borrowerName,
      borrow_date: borrowDate
    });

    closeOverlay(dom.borrowModalOverlay);
    await refreshData();
    showToast({
      type: "success",
      title: "امانت ثبت شد",
      message: "اطلاعات امانت کتاب با موفقیت ثبت گردید."
    });
  } catch (error) {
    showFormNotice(dom.borrowFormNotice, "ثبت امانت انجام نشد. لطفا دوباره تلاش کنید.", "error");
    await showDialog({
      title: "خطا در ثبت امانت",
      message: getFriendlyError(error),
      type: "danger",
      confirmText: "متوجه شدم"
    });
  } finally {
    setButtonBusy(submitBtn, false, defaultSubmitText);
  }
}

async function onReturnBook() {
  const selectedBook = await requireSelection();
  if (!selectedBook) {
    return;
  }

  if (selectedBook.status !== STATUS_BORROWED) {
    await showDialog({
      title: "بازگردانی امکان‌پذیر نیست",
      message: "این کتاب در وضعیت امانت قرار ندارد.",
      type: "warning",
      confirmText: "متوجه شدم"
    });
    return;
  }

  const confirmed = await showDialog({
    title: "تایید بازگردانی",
    message: `آیا بازگردانی کتاب «${selectedBook.title}» ثبت شود؟`,
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
    showToast({
      type: "success",
      title: "بازگردانی ثبت شد",
      message: "وضعیت کتاب به «موجود» تغییر کرد."
    });
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
      message: "ابتدا یک کتاب از جدول انتخاب کنید، سپس عملیات موردنظر را انجام دهید.",
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
  overlay.classList.remove("hidden", "is-closing");
  requestAnimationFrame(() => {
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
  });
}

function closeOverlay(overlay) {
  clearOverlayTimer(overlay);
  overlay.classList.remove("is-open");
  overlay.classList.add("is-closing");
  overlay.setAttribute("aria-hidden", "true");

  const timer = setTimeout(() => {
    overlay.classList.add("hidden");
    overlay.classList.remove("is-closing");
    state.overlayTimers.delete(overlay);
  }, OVERLAY_CLOSE_MS);

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
      title = "پیام سامانه",
      message = "",
      type = "info",
      confirmText = "تایید",
      cancelText = "انصراف",
      cancelable = false
    } = options;

    const dialogTypes = {
      info: { icon: "i", className: "dialog-card-info", buttonClass: "btn-primary" },
      warning: { icon: "!", className: "dialog-card-warning", buttonClass: "btn-primary" },
      danger: { icon: "×", className: "dialog-card-danger", buttonClass: "btn-danger" },
      success: { icon: "✓", className: "dialog-card-success", buttonClass: "btn-secondary" }
    };

    const style = dialogTypes[type] || dialogTypes.info;

    dom.dialogTitle.textContent = title;
    dom.dialogMessage.textContent = message;
    dom.dialogConfirmBtn.textContent = confirmText;
    dom.dialogCancelBtn.textContent = cancelText;
    dom.dialogOverlay.dataset.cancelable = cancelable ? "yes" : "no";
    dom.dialogCancelBtn.classList.toggle("hidden", !cancelable);

    dom.dialogCard.classList.remove(
      "dialog-card-info",
      "dialog-card-warning",
      "dialog-card-danger",
      "dialog-card-success"
    );
    dom.dialogCard.classList.add(style.className);

    dom.dialogConfirmBtn.classList.remove("btn-primary", "btn-secondary", "btn-danger");
    dom.dialogConfirmBtn.classList.add(style.buttonClass);

    dom.dialogIcon.textContent = style.icon;

    state.dialogResolver = resolve;
    openOverlay(dom.dialogOverlay);

    setTimeout(() => {
      dom.dialogConfirmBtn.focus();
    }, 20);
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

function showToast(input, fallbackType = "info") {
  const payload =
    typeof input === "string"
      ? { message: input, type: fallbackType }
      : {
          type: input?.type || fallbackType,
          title: input?.title,
          message: input?.message || "",
          duration: input?.duration
        };

  const type = payload.type === "danger" ? "error" : payload.type;
  const meta = getToastMeta(type);
  const toast = document.createElement("article");
  toast.className = `toast ${type}`;

  const inner = document.createElement("div");
  inner.className = "toast-inner";

  const icon = document.createElement("span");
  icon.className = "toast-icon";
  icon.textContent = meta.icon;

  const content = document.createElement("div");

  const title = document.createElement("p");
  title.className = "toast-title";
  title.textContent = payload.title || meta.title;

  const message = document.createElement("p");
  message.className = "toast-message";
  message.textContent = payload.message;

  content.appendChild(title);
  content.appendChild(message);
  inner.appendChild(icon);
  inner.appendChild(content);

  const progress = document.createElement("span");
  progress.className = "toast-progress";

  toast.appendChild(inner);
  toast.appendChild(progress);
  dom.toastContainer.appendChild(toast);

  const duration = Number(payload.duration) > 1200 ? Number(payload.duration) : 2600;
  progress.style.animationDuration = `${duration}ms`;

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px) scale(0.98)";
    setTimeout(() => toast.remove(), 220);
  }, duration);
}

function getToastMeta(type) {
  if (type === "success") {
    return { icon: "✓", title: "موفق" };
  }
  if (type === "error" || type === "danger") {
    return { icon: "×", title: "خطا" };
  }
  if (type === "warning") {
    return { icon: "!", title: "هشدار" };
  }
  return { icon: "i", title: "اطلاع" };
}

function setButtonBusy(button, busy, busyText = "") {
  if (!button) {
    return;
  }

  button.disabled = busy;
  if (busy && busyText) {
    button.textContent = busyText;
  }
}

function clearFormValidation(form, noticeElement) {
  if (!form) {
    return;
  }

  form.querySelectorAll(".form-field").forEach((field) => {
    field.classList.remove("has-error", "has-valid");
  });

  form.querySelectorAll(".field-error").forEach((node) => {
    node.textContent = "";
  });

  clearFormNotice(noticeElement);
}

function setFieldError(input, message) {
  const field = input?.closest(".form-field");
  const errorNode = document.getElementById(`${input.id}Error`);

  if (field) {
    field.classList.add("has-error");
    field.classList.remove("has-valid");
  }

  if (errorNode) {
    errorNode.textContent = message;
  }

  input?.setAttribute("aria-invalid", "true");
}

function setFieldValid(input) {
  if (!input) {
    return;
  }

  const field = input.closest(".form-field");
  const errorNode = document.getElementById(`${input.id}Error`);

  if (field) {
    field.classList.remove("has-error");
    field.classList.add("has-valid");
  }

  if (errorNode) {
    errorNode.textContent = "";
  }

  input.removeAttribute("aria-invalid");
}

function showFormNotice(noticeElement, message, type = "error") {
  if (!noticeElement) {
    return;
  }

  noticeElement.textContent = message;
  noticeElement.classList.remove("hidden", "notice-error", "notice-success");
  if (type === "success") {
    noticeElement.classList.add("notice-success");
    return;
  }
  noticeElement.classList.add("notice-error");
}

function clearFormNotice(noticeElement) {
  if (!noticeElement) {
    return;
  }

  noticeElement.textContent = "";
  noticeElement.classList.add("hidden");
  noticeElement.classList.remove("notice-error", "notice-success");
}

function validatePublishYear(rawValue) {
  if (!rawValue) {
    return "";
  }

  const year = Number(rawValue);
  if (!Number.isInteger(year) || year < 1000 || year > 2100) {
    return `سال انتشار باید یک عدد صحیح بین ${toPersianDigits(1000)} تا ${toPersianDigits(2100)} باشد.`;
  }

  return "";
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
  const text = error?.message || "خطای ناشناخته‌ای رخ داده است.";
  const match = text.match(/Error invoking remote method '[^']+': (.+)$/);
  if (match && match[1]) {
    return match[1];
  }
  return text;
}
