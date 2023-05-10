const express = require('express')
const compression = require('compression')
const cors = require('cors')
const helmet = require('helmet')
require('dotenv/config')

const configureApp = app => {
  app.use(express.json())
  app.use(cors())
  app.use(compression())
  app.use(helmet())
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'", 'https://*.googleapis.com', 'https://*.gstatic.com'],
      },
    })
  )
}

module.exports = { configureApp }
