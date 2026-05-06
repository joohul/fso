//const config = require('./utils/config')
const Blog = require('./models/blog')
const express = require('express')
const app = express()
app.use(express.json())

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)


module.exports = app