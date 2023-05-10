const mongoose = require('mongoose')
const connectionString = process.env.MONGODB_CONNECTION_STRING || 'mongodb://localhost'
mongoose.set('debug', true)

const mongoDBConnection = async () => {
  mongoose
    .connect(connectionString, {
      dbName: process.env.DB_NAME,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('Database Connection Established.'))
    .catch(console.log)
}

module.exports = { mongoDBConnection }
