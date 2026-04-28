const { isUserFacingError } = require("../shared/errors");
const { IPC_CHANNELS } = require("../shared/ipc/channels");

const GENERIC_RENDERER_ERROR_MESSAGE = "Unable to complete the request.";

function toRendererError(error) {
  if (isUserFacingError(error)) {
    return new Error(error.message);
  }

  return new Error(GENERIC_RENDERER_ERROR_MESSAGE);
}

function withIpcErrorBoundary(channel, handler) {
  return async (event, payload) => {
    try {
      return await handler(event, payload);
    } catch (error) {
      console.error(`[ipc:${channel}]`, error);
      throw toRendererError(error);
    }
  };
}

function registerBookIpcHandlers(ipcMain, libraryDb) {
  const handlers = [
    [IPC_CHANNELS.BOOKS_GET_ALL, (_event, filters = {}) => libraryDb.getBooks(filters)],
    [IPC_CHANNELS.BOOKS_SUMMARY, () => libraryDb.getSummary()],
    [IPC_CHANNELS.BOOKS_ADD, (_event, payload) => libraryDb.addBook(payload)],
    [IPC_CHANNELS.BOOKS_UPDATE, (_event, payload) => libraryDb.updateBook(payload)],
    [IPC_CHANNELS.BOOKS_DELETE, (_event, id) => libraryDb.deleteBook(id)],
    [IPC_CHANNELS.BOOKS_BORROW, (_event, payload) => libraryDb.borrowBook(payload)],
    [IPC_CHANNELS.BOOKS_RETURN, (_event, id) => libraryDb.returnBook(id)]
  ];

  handlers.forEach(([channel, handler]) => {
    ipcMain.handle(channel, withIpcErrorBoundary(channel, handler));
  });
}

module.exports = {
  registerBookIpcHandlers
};
