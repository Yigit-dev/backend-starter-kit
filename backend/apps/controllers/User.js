const httpStatus = require('http-status')
const APIError = require('../core/errors/ApiError')
const { UserService } = require('../core/services')
const BaseController = require('../core/controllers/Base')
const { passwordToHash, generateAccessToken, generateRefreshToken } = require('../scripts/helpers/auth')

class UserController extends BaseController {
  constructor(service) {
    super(service)
    this.signup = this.signup.bind(this)
    this.login = this.login.bind(this)
    this.changePassword = this.changePassword.bind(this)
    this.resetPassword = this.resetPassword.bind(this)
  }
  // use than-catch
  async signup(req, res, next) {
    req.body.password = passwordToHash(req.body.password)
    this.service
      .insert(req.body)
      .then(response => {
        res.status(httpStatus.CREATED).send(response)
      })
      .catch(e => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e)
      })
  }
  // use try-catch
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
