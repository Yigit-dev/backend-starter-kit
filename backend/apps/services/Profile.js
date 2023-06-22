const Profile = require('../models/profile')
const BaseService = require('../../core/services/Base')
const BaseCacheService = require('../../core/services/BaseCache')

class ProfileService extends BaseService {
  constructor(model, useCache) {
    super(model)
    this.useCache = useCache
    if (useCache) {
      this.baseCacheService = new BaseCacheService(model, 600)
    }
  }
}

module.exports = new ProfileService(Profile, true)
