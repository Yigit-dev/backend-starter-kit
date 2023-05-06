const express = require('express')
const config = require('./config')
const PORT = process.env.PORT || 3000
const app = express()
config(app)

// --- ROUTES ----
const { TodoRoutes, UserRoutes } = require('./routes')
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
