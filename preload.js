const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("libraryAPI", {
  getBooks: (filters) => ipcRenderer.invoke("books:get-all", filters),
  getSummary: () => ipcRenderer.invoke("books:summary"),
  addBook: (payload) => ipcRenderer.invoke("books:add", payload),
  updateBook: (payload) => ipcRenderer.invoke("books:update", payload),
  deleteBook: (id) => ipcRenderer.invoke("books:delete", id),
  borrowBook: (payload) => ipcRenderer.invoke("books:borrow", payload),
  returnBook: (id) => ipcRenderer.invoke("books:return", id)
});
