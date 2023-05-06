const mongoose = require('mongoose')
const logger = require('../scripts/logger/user')

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 5 }
  },
  { timestamps: true, versionKey: false }
)

UserSchema.post('save', document => {
  logger.log({ level: 'info', message: document })
})

module.exports = mongoose.model('User', UserSchema)
