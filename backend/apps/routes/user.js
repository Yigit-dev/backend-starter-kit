const router = require('express').Router()
const validate = require('~/middlewares/validate')
const authenticate = require('~/middlewares/auth')
const schemas = require('@/validations/user')
const UserController = require('@/controllers/User')

router.get('/', UserController.load)
router.route('/').post(validate(schemas.createValidation), UserController.signup)
router.route('/').patch(authenticate, validate(schemas.updateValidation), UserController.update)
router.route('/login').post(validate(schemas.loginValidation), UserController.login)
router.route('/change-password').post(authenticate, validate(schemas.changePasswordValidation), UserController.changePassword)
router.route('/:id').delete(authenticate, UserController.delete)

// router.route('/projects').get(authenticate, UserController.projectList)
// router.route('/reset-password').post(validate(schemas.resetPasswordValidation), UserController.resetPassword)
// router.route('/update-profile-image').post(authenticate, UserController.updateProfileImage)

module.exports = router
