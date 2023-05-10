const Todo = require('@/models/todo')
const BaseService = require('~/services/Base')
const BaseCacheService = require('~/services/BaseCache')

class TodoService extends BaseService {
  constructor(model, useCache) {
    super(model)
    this.useCache = useCache
    if (useCache) {
      this.baseCacheService = new BaseCacheService(model, 600)
    }
  }
}

module.exports = new TodoService(Todo, true)
