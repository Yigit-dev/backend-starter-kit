const httpStatus = require('http-status')
const User = require('@/models/user')
const BaseService = require('./Base')
const APIError = require('@/errors/ApiError')
const { generateAccessToken, generateRefreshToken } = require('~/utils/auth')

class UserService extends BaseService {
  async login(user) {
    try {
      user = {
        ...user.toObject(),
        tokens: {
          access_token: generateAccessToken(user),
          refresh_token: generateRefreshToken(user),
        },
      }
      delete user.password
      return user
    } catch (e) {
      return new APIError(e?.message, httpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}

module.exports = new UserService(User)
