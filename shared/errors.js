const USER_FACING_ERROR_CODE = "USER_FACING_ERROR";

function createUserFacingError(message) {
  const error = new Error(message);
  error.code = USER_FACING_ERROR_CODE;
  return error;
}

function isUserFacingError(error) {
  return Boolean(error && error.code === USER_FACING_ERROR_CODE);
}

module.exports = {
  USER_FACING_ERROR_CODE,
  createUserFacingError,
  isUserFacingError
};
