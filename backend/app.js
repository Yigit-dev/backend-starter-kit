const express = require('express')
const config = require('~/config')
const PORT = process.env.PORT || 3000
const app = express()
config(app)

// -------------------- RABBITMQ EXAMPLE
// const RabbitMQConnection = require('./services/RabbitMQConnection')
const QueueManager = require('~/services/QueueManager')
async function main() {
  // RabbitMQ bağlantısını kuruyoruz

  // İki farklı kuyruk yöneticisi örneği oluşturuyoruz
  const orderQueueManager = new QueueManager({ queueName: 'orders' })
  const notificationQueueManager = new QueueManager({ queueName: 'notifications' })

  // Kuyrukları oluşturuyoruz
  await orderQueueManager.createQueue()
  await notificationQueueManager.createQueue()

  // Kuyruklara mesajlar ekliyoruz
  await orderQueueManager.sendToQueue({
    orderId: '123456',
    customerName: 'John Doe',
    items: [
      {
        productId: 'p001',
        productName: 'Product 1',
        price: 10.99,
        quantity: 1,
      },
      {
        productId: 'p002',
        productName: 'Product 2',
        price: 9.99,
        quantity: 2,
      },
    ],
  })

  await notificationQueueManager.sendToQueue({
    userId: 1,
    username: 'yigit',
    message: 'Hi Rabbit!',
  })

  // Kuyruklardan mesajları işliyoruz
  orderQueueManager.consume(order => {
    console.log(`Sipariş alındı: ${JSON.stringify(order)}`)
    // Siparişi işliyoruz
    // ...
  })

  notificationQueueManager.consume(notification => {
    console.log(`Bildirim alındı: ${JSON.stringify(notification)}`)
    // Bildirimi işliyoruz
    // ...
  })
}

main()

// -- RabbitMQ Example END -----------

// --- ROUTES ----
const { TodoRoutes, UserRoutes } = require('@/routes')
// app.use('/', router)
app.use('/todos', TodoRoutes)
app.use('/users', UserRoutes)

app.use((req, res, next) => {
  const error = new Error('Page is not found')
  error.status = 404
  next(error)
})

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`)
})

module.exports = app
