const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
  Blog.find({}).populate('user').then((blogs) => {
    response.json(blogs)
  })
})

blogsRouter.post('/', async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = request.user

  if (!request.body.title || !request.body.url) {
    return response.status(400).json({ error: 'title or url missing' })
  }
  const blog = new Blog({ ...request.body, user: user._id })
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

// Async/await and .then() are now mixed in this file, would probably be best to have only one style but this was what was asked for in the exercise.
blogsRouter.delete('/:id', async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = request.user

  const blogToDelete = await Blog.findById(request.params.id)
  if (!blogToDelete) {
    return response.status(404).json({ error: 'blog not found' })
  }

  if (blogToDelete.user.toString() !== user._id.toString()) {
    return response.status(403).json({ error: 'user does not match blog creator' })
  }

  const blog = await Blog.findByIdAndDelete(request.params.id)
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