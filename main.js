const path = require("path");
const { app, BrowserWindow, ipcMain } = require("electron");
const libraryDb = require("./database/db");

let mainWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1150,
    minHeight: 760,
    autoHideMenuBar: true,
    title: "سامانه مدیریت کتابخانه شخصی و ثبت امانت کتاب",
    backgroundColor: "#f3f6fb",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, "renderer", "index.html"));
}

function registerIpcHandlers() {
  ipcMain.handle("books:get-all", (_event, filters = {}) => {
    return libraryDb.getBooks(filters);
  });

  ipcMain.handle("books:summary", () => {
    return libraryDb.getSummary();
  });

  ipcMain.handle("books:add", (_event, payload) => {
    return libraryDb.addBook(payload);
  });

  ipcMain.handle("books:update", (_event, payload) => {
    return libraryDb.updateBook(payload);
  });

  ipcMain.handle("books:delete", (_event, id) => {
    return libraryDb.deleteBook(id);
  });

  ipcMain.handle("books:borrow", (_event, payload) => {
    return libraryDb.borrowBook(payload);
  });

  ipcMain.handle("books:return", (_event, id) => {
    return libraryDb.returnBook(id);
  });
}

app.whenReady().then(() => {
  const dbPath = path.join(app.getPath("userData"), "library.sqlite");
  libraryDb.initializeDatabase(dbPath);
  registerIpcHandlers();
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  libraryDb.closeDatabase();
});
