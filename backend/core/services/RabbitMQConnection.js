const amqp = require('amqplib')
const handleAsync = require('~/utils/handleAsync')
const handleError = require('~/utils/handleError')

class RabbitMQConnection {
  constructor(channels = 2) {
    this.connectionString = process.env.RABBITMQ_URL
    this._connection = null
    this._channels = []
    this._channelIndex = 0
    this._numChannels = channels
  }

  // Singleton
  static getInstance(channels = 2) {
    if (!RabbitMQConnection._instance) {
      RabbitMQConnection._instance = new RabbitMQConnection(channels)
    }
    return RabbitMQConnection._instance
  }

  async connect() {
    const [connection, connectionError] = await handleAsync(amqp.connect(this.connectionString))
    if (connectionError) {
      handleError(connectionError)
    } else {
      this._connection = connection
      const [channels, channelsError] = await handleAsync(this.createChannels())
      if (channelsError) {
        handleError(channelsError)
      } else {
        this._channels = channels
        console.log('RabbitMQ Connected')
      }
    }
  }

  async createChannels() {
    const channelPromises = Array.from({ length: this._numChannels }, async () => {
      const [channel, error] = await handleAsync(this._connection.createChannel())
      if (error) {
        return [null, error]
      }
      return [channel, null]
    })
    const channels = await Promise.all(channelPromises)
    const errorChannels = channels.filter(([channel, error]) => error)
    if (errorChannels.length > 0) {
      const [channel, error] = errorChannels[0]
      handleError(error)
    }
    return channels.map(([channel, error]) => channel)
  }

  async close() {
    if (this._connection) {
      await this._connection.close()
    }
  }

  async useChannel(callbackFn) {
    const channel = this._channels[this._channelIndex]
    // * In this way, channels are used cyclically, ensuring equal use of each channel.
    this._channelIndex = (this._channelIndex + 1) % this._numChannels
    // * callbackFn: works with existing channel
    const [result, error] = await handleAsync(callbackFn(channel))
    if (error) {
      handleError(error)
    }
    return result
  }
}

module.exports = RabbitMQConnection
