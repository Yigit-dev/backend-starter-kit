const BaseController = require('./Base')
const { TodoService } = require('../services')
const BaseCacheController = require('./BaseCache')

class TodoController extends (TodoService.useCache ? BaseCacheController : BaseController) {
  constructor(service) {
    super(service)
  }
}

module.exports = new TodoController(TodoService)
