const blogsRouter = require('express').Router()
const { get } = require('mongoose')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
  console.log('authorization:', authorization)
}

blogsRouter.get('/', (request, response) => {
  Blog.find({}).populate('user').then((blogs) => {
    response.json(blogs)
  })
})

blogsRouter.post('/', async (request, response) => {
  if (!getTokenFrom(request)) {
    return response.status(401).json({ error: 'token missing' })
  }
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  if (!request.body.title || !request.body.url) {
    return response.status(400).json({ error: 'title or url missing' })
  }
  const blog = new Blog({ ...request.body, user: user._id })
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

// Async/await and .then() are now mixed in this file, would probably be best to have only one style but this was what was asked for in the exercise.
blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findByIdAndDelete(request.params.id)
  // return 404 if blog with id doesn't exist, 204 if it was deleted successfully
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const oldBlog = await Blog.findById(request.params.id)
  if (!oldBlog) {
    return response.status(404).json({ error: 'blog not found' })
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, body, { returnDocument: 'after' })
  response.status(200).json(updatedBlog)
})


module.exports = blogsRouter