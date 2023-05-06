const httpStatus = require('http-status')
const handleAsync = require('../scripts/helpers/handleAsync')
const BaseController = require('./Base')
const handleError = require('../errors/handleError')

class BaseCacheController extends BaseController {
  constructor(service) {
    super(service)
    this.service = service
    this.cacheService = service.baseCacheService
  }

  loadWithCache = async (req, res, next) => {
    const [response, error] = await handleAsync(this.cacheService.cachingLoad(async () => this.service.load()))
    if (error) return handleError(error, next)

    res.status(httpStatus.OK).send(response)
  }

  createWithCache = async (req, res, next) => {
    const [response, error] = await handleAsync(this.service.insert(req.body))
    if (error) return handleError(error, next)

    await this.cacheService.addToCache(response)
    res.status(httpStatus.CREATED).send(response)
  }

  updateWithCache = async (req, res, next) => {
    const { id } = req.params
    const [response, error] = await handleAsync(this.service.update(id, req.body))
    if (error) return handleError(error, next)

    await this.cacheService.updateInCache(id, { ...response, ...req.body })
    res.status(httpStatus.OK).send(response)
  }

  deleteWithCache = async (req, res, next) => {
    const { id } = req.params
    const [response, error] = await handleAsync(this.service.removeBy('_id', id))
    if (error) return handleError(error, next)

    await this.cacheService.removeFromCache(id)
    res.status(httpStatus.OK).send(response)
  }
}

module.exports = BaseCacheController
