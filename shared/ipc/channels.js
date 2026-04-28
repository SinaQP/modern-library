const IPC_CHANNELS = Object.freeze({
  BOOKS_GET_ALL: "books:get-all",
  BOOKS_SUMMARY: "books:summary",
  BOOKS_ADD: "books:add",
  BOOKS_UPDATE: "books:update",
  BOOKS_DELETE: "books:delete",
  BOOKS_BORROW: "books:borrow",
  BOOKS_RETURN: "books:return"
});

module.exports = {
  IPC_CHANNELS
};
