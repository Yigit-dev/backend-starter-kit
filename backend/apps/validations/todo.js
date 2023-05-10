const Joi = require('joi')

const createValidation = Joi.object({
  title: Joi.string().required().min(1),
  description: Joi.string().min(1),
  isCompleted: Joi.boolean(),
})

const updateValidation = Joi.object({
  title: Joi.string().min(1),
  description: Joi.string().min(1),
  isCompleted: Joi.boolean(),
})

module.exports = { createValidation, updateValidation }
