const fs = require("fs");
const path = require("path");
const { app, BrowserWindow, ipcMain } = require("electron");
const libraryDb = require("./database/db");
const { registerBookIpcHandlers } = require("./ipc/book-handlers");

let mainWindow;

function getRendererEntryPath() {
  const reactRendererPath = path.join(__dirname, "renderer-dist", "index.html");

  if (fs.existsSync(reactRendererPath)) {
    return reactRendererPath;
  }

  return path.join(__dirname, "renderer", "index.html");
}

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
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true
    }
  });

  mainWindow.webContents.on("will-navigate", (event) => {
    event.preventDefault();
  });

  mainWindow.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  mainWindow.once("closed", () => {
    mainWindow = null;
  });

  mainWindow.loadFile(getRendererEntryPath());
}

app.whenReady()
  .then(() => {
    const dbPath = path.join(app.getPath("userData"), "library.sqlite");
    libraryDb.initializeDatabase(dbPath);
    registerBookIpcHandlers(ipcMain, libraryDb);
    createMainWindow();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
      }
    });
  })
  .catch((error) => {
    console.error("[app:startup]", error);
    app.quit();
  });

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  libraryDb.closeDatabase();
});
