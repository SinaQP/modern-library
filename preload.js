const { contextBridge, ipcRenderer } = require("electron");

// Sandboxed preload scripts cannot import app-local modules without bundling.
const IPC_CHANNELS = Object.freeze({
  BOOKS_GET_ALL: "books:get-all",
  BOOKS_SUMMARY: "books:summary",
  BOOKS_ADD: "books:add",
  BOOKS_UPDATE: "books:update",
  BOOKS_DELETE: "books:delete",
  BOOKS_BORROW: "books:borrow",
  BOOKS_RETURN: "books:return"
});

contextBridge.exposeInMainWorld("libraryAPI", {
  getBooks: (filters) => ipcRenderer.invoke(IPC_CHANNELS.BOOKS_GET_ALL, filters),
  getSummary: () => ipcRenderer.invoke(IPC_CHANNELS.BOOKS_SUMMARY),
  addBook: (payload) => ipcRenderer.invoke(IPC_CHANNELS.BOOKS_ADD, payload),
  updateBook: (payload) => ipcRenderer.invoke(IPC_CHANNELS.BOOKS_UPDATE, payload),
  deleteBook: (id) => ipcRenderer.invoke(IPC_CHANNELS.BOOKS_DELETE, id),
  borrowBook: (payload) => ipcRenderer.invoke(IPC_CHANNELS.BOOKS_BORROW, payload),
  returnBook: (id) => ipcRenderer.invoke(IPC_CHANNELS.BOOKS_RETURN, id)
});
