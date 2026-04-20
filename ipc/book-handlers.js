function withIpcErrorBoundary(channel, handler) {
  return async (event, payload) => {
    try {
      return await handler(event, payload);
    } catch (error) {
      console.error(`[ipc:${channel}]`, error);
      throw error;
    }
  };
}

function registerBookIpcHandlers(ipcMain, libraryDb) {
  const handlers = [
    ["books:get-all", (_event, filters = {}) => libraryDb.getBooks(filters)],
    ["books:summary", () => libraryDb.getSummary()],
    ["books:add", (_event, payload) => libraryDb.addBook(payload)],
    ["books:update", (_event, payload) => libraryDb.updateBook(payload)],
    ["books:delete", (_event, id) => libraryDb.deleteBook(id)],
    ["books:borrow", (_event, payload) => libraryDb.borrowBook(payload)],
    ["books:return", (_event, id) => libraryDb.returnBook(id)]
  ];

  handlers.forEach(([channel, handler]) => {
    ipcMain.handle(channel, withIpcErrorBoundary(channel, handler));
  });
}

module.exports = {
  registerBookIpcHandlers
};
