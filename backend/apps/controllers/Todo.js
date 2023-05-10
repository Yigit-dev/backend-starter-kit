const BaseController = require('~/controllers/Base')
const { TodoService } = require('@/services')
const BaseCacheController = require('~/controllers/BaseCache')

class TodoController extends (TodoService.useCache ? BaseCacheController : BaseController) {
  constructor(service) {
    super(service)
  }
}

module.exports = new TodoController(TodoService)
