const redis = require('redis')
const redisUrl = process.env.REDIS_URL
const client = redis.createClient({ url: redisUrl })

const redisCacheConnection = async () => {
  client.connect()

  client.on('connect', () => console.log('Redis Client Connected'))
  client.on('error', function (error) {
    console.error('Redis Connection Error', error)
  })
}

module.exports = { client, redisCacheConnection }
