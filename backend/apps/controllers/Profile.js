const BaseController = require('../../core/controllers/Base')
const { ProfileService } = require('../services')
const BaseCacheController = require('../../core/controllers/BaseCache')

class ProfileController extends (ProfileService.useCache ? BaseCacheController : BaseController) {
  constructor(service) {
    super(service)
  }
}

module.exports = new ProfileController(ProfileService)
