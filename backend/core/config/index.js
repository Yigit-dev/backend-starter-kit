const { redisCacheConnection } = require('./redis')
const { mongoDBConnection } = require('./database')
const { configureApp } = require('./configureApp')

module.exports = app => {
  configureApp(app)
  mongoDBConnection()
  redisCacheConnection()
}
