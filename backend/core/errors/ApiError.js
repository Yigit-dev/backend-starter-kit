class APIError extends Error {
  constructor(message, statusCode, file, line) {
    super(message)
    this.statusCode = statusCode || 400
    this.file = file
    this.line = line
  }
}
module.exports = APIError
