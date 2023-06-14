const handleAsync = require('~/utils/handleAsync')
const handleError = require('~/utils/handleError')
const RabbitMQConnection = require('~/services/RabbitMQConnection')

class QueueManager {
  constructor({ queueName }) {
    this.rabbitMQConnection = RabbitMQConnection.getInstance()
    this.queueName = queueName
    this.initConnection()
  }

  async initConnection() {
    await this.rabbitMQConnection.connect()
  }

  async createQueue(queueOptions = {}) {
    if (!(queueOptions instanceof Object)) {
      return handleError(new Error('Invalid queue options'))
    }

    const options = {
      durable: true,
      maxLength: typeof queueOptions.maxInMemoryLength === 'number' && queueOptions.maxInMemoryLength > 0 ? queueOptions.maxInMemoryLength : 1000,
      maxPriority: typeof queueOptions.maxPriority === 'number' && queueOptions.maxPriority > 0 ? queueOptions.maxPriority : 10,
      ...queueOptions,
    }

    const [queue, assertQueueError] = await handleAsync(
      this.rabbitMQConnection.useChannel(async channel => {
        return channel.assertQueue(this.queueName, options)
      })
    )

    if (assertQueueError) {
      return handleError(assertQueueError)
    }

    return queue
  }

  async sendToQueue(message, messageOptions = {}) {
    if (!message) {
      return handleError(new Error('Message is required'))
    }

    if (!(messageOptions instanceof Object)) {
      return handleError(new Error('Invalid message options'))
    }

    const options = {
      persistent: typeof messageOptions.persistent === 'boolean' ? messageOptions.persistent : true,
      priority: typeof messageOptions.priority === 'number' ? messageOptions.priority : 0,
      ...messageOptions,
    }

    const [sendToQueueResult, sendToQueueError] = await handleAsync(
      this.rabbitMQConnection.useChannel(async channel => {
        return channel.sendToQueue(this.queueName, Buffer.from(JSON.stringify(message)), options)
      })
    )

    if (sendToQueueError) {
      return handleError(sendToQueueError)
    }

    return sendToQueueResult
  }

  async consume(onMessage, options = { noAcknowledge: false }) {
    const [consumeResult, consumeError] = await handleAsync(
      this.rabbitMQConnection.useChannel(async channel => {
        return channel.consume(
          this.queueName,
          async message => {
            if (message) {
              const content = JSON.parse(message.content.toString())
              onMessage(content)
              if (!options.noAcknowledge) {
                channel.ack(message)
              }
            }
          },
          options
        )
      })
    )

    if (consumeError) {
      return handleError(consumeError)
    }

    return consumeResult
  }

  async deleteQueue() {
    const [deleteQueueResult, deleteQueueError] = await handleAsync(
      this.rabbitMQConnection.useChannel(async channel => {
        return channel.deleteQueue(this.queueName)
      })
    )

    if (deleteQueueError) {
      return handleError(deleteQueueError)
    }
    return deleteQueueResult
  }
}
module.exports = QueueManager
