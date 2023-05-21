# Backend Starter Kit

This project is a backend application designed with object-oriented principles for quick customization and equipped with sophisticated structures for pre-production. It adheres to the principles of modularity, performance, maintainability, and clean coding.

This backend app uses object-oriented programming. It's made for easy modification and advanced structures, focusing on modularity, performance, and clean code.

## Table of Content
- [General Flow](#General-Flow)
- [Base Service](#Base-Service)
- [Base Controller](#Base-Controller)
- [Routes](#Routes)
- [Cache](#Cache)
- [Message Broker - RabbitMQ](#Message-Broker---RabbitMQ)
- [Technologies](#Technologies)

# ****General Flow****

**Route → Controller → Service**

1. Routes establish a connection to the controllers.
2. Controllers act as a bridge, linking the services with requests and responses.
3. Services interact with the Database and Cache (optional).

These methods use `handleAsync` and `handleError` helper functions to capture and manage errors.

## Base Service

**The** **Base Service** implements basic CRUD and search operations in accordance with Object-Oriented Programming principles using Mongoose. By extending your specific model service from **the Base Service**, you avoid repetitive writing of basic operations. **The** **Base Service** expects a model parameter from you. Simply provide the model, and it handles all basic operations dynamically.

- You can override methods if needed.
- You can add requests specific to your model.

Example:

```jsx
const Todo = require('@/models/todo')
const BaseService = require('~/services/Base')

class TodoService extends BaseService {
  constructor(model) {
    super(model)
    this.useCache = useCache
  }
	
	// Todo Specific Methods...

	// @override: async update() {}
}

// You have to give the Model constructor
module.exports = new TodoService(Todo)
```

## Base Controller

**The Base Controller** allows access to **the Base Service** via request and response. It provides methods that perform basic operations implemented in **the Base Service**. **The Base Controller** class expects a service parameter from you. Simply provide the service, and it performs all basic operations dynamically.

Example:

```jsx
const BaseController = require('~/controllers/Base')
const { TodoService } = require('@/services')

class TodoController extends BaseController {
  constructor(service) {
    super(service)
  }
	// Todo Specific Methods...

	// @override: async create() {}
}

// You have to give the Service constructor. 
// TodoService takes the model (todo) as a parameter.
module.exports = new TodoController(TodoService)
```

## Routes

Finally, since the TodoController extends from BaseController, all methods are readily available!

Example

```jsx
const router = require('express').Router()
const validate = require('~/middlewares/validate')
const auth = require('~/middlewares/auth')
const schema = require('@/validations/todo')
const todo = require('@/controllers/Todo')

router.route('/').get(auth, todo.load)
router.route('/:id').get(auth, todo.find)
router.route('/').post(auth, validate(schema.createValidation), todo.create)
router.route('/:id').patch(auth, validate(schema.updateValidation), todo.update)
router.route('/:id').delete(auth, todo.delete)
```

# Cache

[The Base Cache Service](./backend/core/services/BaseCache.js) class is provided for managing data caching in Redis. Thus, the results of requests are cached, preventing the system from repeatedly serving the same request.

This class manages the Redis cache for a specific model. The Redis connection, cache key, and cache timeout (TTL) are determined when the class is created.

**getCachedData:**

It retrieves data from the cache. Data stored in JSON format is parsed before it's returned.

**setCachedData:**

It takes specific data and a timeout as parameters and caches this data in Redis. The data is converted to JSON format before being stored.

**cachingLoad:**

It fetches data from the cache. If no data exists in the cache, it uses the provided callback method to fetch the data from the database and write it to the cache.

**addToCache:**

It takes specific data and adds this data to the existing cached data.

**updateInCache:**

It takes data with a specific ID and updates this data. The current data in the cache is found and updated based on the ID.

**removeFromCache:**

It takes data with a specific ID and removes this data from the cache.

Cache is updated after Post, Update, Delete operations (you can also schedule the update at specific intervals).

By simply declaring `useCache = true` when extending your class, basic CRUD operations are handled.

```jsx
const Todo = require('@/models/todo')
const BaseService = require('~/services/Base')
const BaseCacheService = require('~/services/BaseCache')

class TodoService extends BaseService {
  constructor(model, useCache) {
    super(model)
    this.useCache = useCache
    if (useCache) {
      this.baseCacheService = new BaseCacheService(model, 600)
    }
  }
	// Todo Specific Methods...

	// @override: async create() {}
}

// You have to give the Model constructor and useCache parameter
module.exports = new TodoService(Todo, true)
```

If you set the `useCache` parameter to true when creating the service, the **Todo Controller** extends from **Base Cache Controller**. This allows you to gain cache functionalities while continuing to use the features of **Base Controller.**

```jsx
const BaseController = require('~/controllers/Base')
const { TodoService } = require('@/services')
const BaseCacheController = require('~/controllers/BaseCache')

class TodoController extends (TodoService.useCache ? BaseCacheController : BaseController) {
  constructor(service) {
    super(service)
  }
}

module.exports = new TodoController(TodoService)
```

# Message Broker - RabbitMQ

## RabbitMQ Connection

[This class](./backend/core/services/RabbitMQConnection.js) sets up a connection with the RabbitMQ server and communicates via different channels.

**Constructor:**

This function creates a new [RabbitMQConnection](./backend/core/services/RabbitMQConnection.js) object. It also creates an empty array for the channels, and the number of channels is determined by the constructor.

**getInstance:**

This is a Singleton method; instead of creating a new object each time, it returns an existing RabbitMQConnection object. This allows the system to use the same RabbitMQ connection across different parts and avoids opening multiple connections.

**connect:**

This method establishes a connection with the RabbitMQ server and creates the specified number of channels.

**createChannels:**

This method creates channels according to the number determined by the constructor. Each channel is created using the `createChannel` method on the connection object.

**useChannel:**

This method runs a given callback function over a specific channel. It also cycles through the index of the channel to ensure equal use of each channel.

**close:**

This method closes the connection to the RabbitMQ server.

## Queue Manager

[This class](./backend/core/services/QueueManager.js) offers various methods for adding messages to the queue, consuming them, and managing the queue.

**Constructor:**

This method creates a new [QueueManager](./backend/core/services/QueueManager.js) object. It takes a RabbitMQConnection singleton object and stores the given queue name.

**initConnection:**

This method initiates the connection to the RabbitMQ server.

**createQueue:**

This method creates a queue with the specified properties. The queue options determine properties like the durability of the queue, its maximum length, and maximum priority.

**sendToQueue:**

This method takes a message and message options (like whether the message is persistent or its priority) and adds the message to the queue.

**consume:**

This method consumes a message in the queue and applies the specified "`onMessage`" callback function. The consumption options decide if messages are automatically acknowledged.

**deleteQueue:**

This method deletes the queue. If an error occurs while deleting the queue, it is caught and handled.

Example: 

```jsx
const QueueManager = require('~/services/QueueManager')

async function main() {

  // create two different queue manager instances
  const orderQueueManager = new QueueManager({ queueName: 'orders' })
  const notificationQueueManager = new QueueManager({ queueName: 'notifications' })

  // create queues
  await orderQueueManager.createQueue()
  await notificationQueueManager.createQueue()

  // 1- Adding messages to queues
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
	// 2- Adding messages to queues
  await notificationQueueManager.sendToQueue({
    userId: 1,
    username: 'Yigit Cakmak',
    message: 'Hello RabbitMQ!',
  })

  // Process messages from queues
  orderQueueManager.consume(order => {
    console.log(`Your order has been taken: ${JSON.stringify(order)}`)
    // Process the Order
    // ...
  })

  notificationQueueManager.consume(notification => {
    console.log(`Notification received: ${JSON.stringify(notification)}`)
    // Process the Notification
    // ...
  })
}

main()
```

# Technologies

* NodeJS
* ExpressJS
* Mongo
* Redis
* RabbitMQ
* PM2
* Helmet
* Winston
* Compression
* Docker

