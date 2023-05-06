const winston = require('winston')

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'todo-service' },
  transports: [
    new winston.transports.File({ filename: './logs/todos/error.log', level: 'error' }),
    new winston.transports.File({ filename: './logs/todos/info.log', level: 'info' }),
    new winston.transports.File({ filename: './logs/todos/combined.log' }),
  ],
})

module.exports = logger
