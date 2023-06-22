const httpStatus = require('http-status')
const APIError = require('~/errors/ApiError')
const { UserService } = require('@/services')
const handleAsync = require('~/utils/handleAsync')
const handleError = require('~/utils/handleError')
const BaseController = require('~/controllers/Base')
const { passwordToHash } = require('~/utils/auth')

class UserController extends BaseController {
  constructor(service) {
    super(service)
    this.service = service
    this.login = this.login.bind(this)
    this.changePassword = this.changePassword.bind(this)
    this.resetPassword = this.resetPassword.bind(this)
  }

  signup = async (req, res, next) => {
    req.body.password = passwordToHash(req.body.password)
    const [response, error] = await handleAsync(this.service.insert(req.body))
    if (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error)
      return handleError(error, next)
    }

    const [profile, profileError] = await handleAsync(this.service.createProfile(response._id))
    if (profileError) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error)
      return handleError(error, next)
    }

    res.status(httpStatus.CREATED).send(response)
  }

  async login(req, res, next) {
    req.body.password = passwordToHash(req.body.password)
    try {
      let user = await this.service.findOne(req.body)
      if (!user) return res.status(httpStatus.NOT_FOUND).send(new APIError('User is not found', httpStatus.NOT_FOUND))
      res.status(httpStatus.OK).send(await this.service.login(user))
    } catch (e) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e?.message)
      next(e)
    }
  }

  async changePassword(req, res) {
    req.body.password = passwordToHash(req.body.password)
    await this.service
      .update({ _id: req.user?._id }, req.body)
      .then(updatedUser => {
        res.status(httpStatus.OK).send(updatedUser)
      })
      .catch(() => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(new APIError('A problem occurred during the update process', httpStatus.INTERNAL_SERVER_ERROR)))
  }

  async resetPassword(req, res) {}
}

module.exports = new UserController(UserService)
