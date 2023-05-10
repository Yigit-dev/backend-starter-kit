const router = require('express').Router()
const validate = require('~/middlewares/validate')
const auth = require('~/middlewares/auth')
const schema = require('@/validations/todo')
const todo = require('@/controllers/Todo')

// NORMAL
// router.route('/').get(todo.load)
// router.route('/:id').get(todo.find)
// router.route('/').post(validate(schema.createValidation), todo.create)
// router.route('/:id').patch(validate(schema.updateValidation), todo.update)
// router.route('/:id').delete(todo.delete)

// CACHE
router.route('/').get(auth, todo.loadWithCache)
router.route('/:id').get(auth, todo.find)
router.route('/').post(auth, validate(schema.createValidation), todo.createWithCache)
router.route('/:id').patch(auth, validate(schema.updateValidation), todo.updateWithCache)
router.route('/:id').delete(auth, todo.deleteWithCache)

module.exports = router
