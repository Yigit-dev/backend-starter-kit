const mongoose = require('mongoose')
const logger = require('../scripts/logger/todo')

const TodoSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    isCompleted: Boolean,
  },
  { timestamps: true, versionKey: false }
)

TodoSchema.post('save', document => {
  logger.log({ level: 'info', message: document })
})

module.exports = mongoose.model('Todo', TodoSchema)
