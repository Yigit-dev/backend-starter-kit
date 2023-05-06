const APIError = require('../errors/ApiError')

const handleError = (error, next) => {
  if (error instanceof APIError) {
    return next(error)
  }
  return next(new APIError(error.message, error.statusCode))
}

module.exports = handleError
