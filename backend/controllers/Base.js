const APIError = require('../errors/ApiError')
const httpStatus = require('http-status')
const handleAsync = require('../scripts/helpers/handleAsync')
const handleError = require('../errors/handleError')

class BaseController {
  constructor(service) {
    this.service = service
  }

  create = async (req, res, next) => {
    const [response, error] = await handleAsync(this.service.insert(req.body))
    if (error) return handleError(error, next)
    res.status(httpStatus.CREATED).send(response)
  }

  load = async (req, res, next) => {
    const [response, error] = await handleAsync(this.service.load())
    if (error) return handleError(error, next)
    res.status(httpStatus.OK).send(response)
  }

  update = async (req, res, next) => {
    const [response, error] = await handleAsync(this.service.update(req.params?.id || req.user?._id, req.body))
    if (error) return handleError(error, next)
    res.status(httpStatus.OK).send(response)
  }

  delete = async (req, res, next) => {
    const [response, error] = await handleAsync(this.service.removeBy('_id', req.params?.id))
    if (error) return handleError(error, next)
    res.status(httpStatus.OK).send(response)
  }

  find = async (req, res, next) => {
    const [response, error] = await handleAsync(this.service.find(req.params?.id))
    if (error) return handleError(error, next)
    res.status(httpStatus.OK).send(response)
  }
}

module.exports = BaseController
