const Joi = require('joi')

const createValidation = Joi.object({
  name: Joi.string().required().min(3),
  email: Joi.string().email().required().min(8),
  password: Joi.string().required().min(6),
})

const updateValidation = Joi.object({
  name: Joi.string().min(3),
  email: Joi.string().email().min(8),
})

const loginValidation = Joi.object({
  email: Joi.string().email().required().min(8),
  password: Joi.string().required().min(6),
})

const resetPasswordValidation = Joi.object({
  email: Joi.string().email().required().min(8),
})

const changePasswordValidation = Joi.object({
  password: Joi.string().required().min(6),
})

module.exports = { createValidation, loginValidation, resetPasswordValidation, updateValidation, changePasswordValidation }
