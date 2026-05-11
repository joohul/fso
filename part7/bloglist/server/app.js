//const config = require('./utils/config')
const path = require('path')
const Blog = require('./models/blog')
const User = require('./models/user')
const jwt = require('jsonwebtoken')
const express = require('express')
const app = express()
app.use(express.json())
const middleware = require('./utils/middleware')


app.use(middleware.tokenExtractor)

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use('/api/blogs', middleware.userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')))

  app.get('/*splat', (request, response) => {
    response.sendFile(path.join(__dirname, '../client/dist', 'index.html'))
  })
}


module.exports = app