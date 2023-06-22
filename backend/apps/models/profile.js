const mongoose = require('mongoose')
const logger = require('../logger/profile')

const ProfileSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Types.ObjectId, ref: 'user' },
    name: { type: String, required: false },
    surname: { type: String, required: false },
  },
  { timestamps: true, versionKey: false }
)

ProfileSchema.post('save', document => {
  logger.log({ level: 'info', message: document })
})

module.exports = mongoose.model('Profile', ProfileSchema)
