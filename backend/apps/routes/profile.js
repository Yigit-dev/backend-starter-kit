const router = require('express').Router()
const validate = require('../../core/middlewares/validate')
const auth = require('../../core/middlewares/auth')
const schema = require('../validations/profile')
const profile = require('../controllers/Profile')

// NORMAL
// router.route('/').get(profile.load)
// router.route('/:id').get(profile.find)
// router.route('/').post(validate(schema.createValidation), profile.create)
// router.route('/:id').patch(validate(schema.updateValidation), profile.update)
// router.route('/:id').delete(profile.delete)

// CACHE
router.route('/').get(auth, profile.loadWithCache)
router.route('/:id').get(auth, profile.find)
router.route('/').post(auth, profile.createWithCache)
router.route('/:id').patch(auth, profile.updateWithCache)
router.route('/:id').delete(auth, profile.deleteWithCache)

module.exports = router
