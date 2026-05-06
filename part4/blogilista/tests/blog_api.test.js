const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

const initialBlogs = [
   {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  }
]

beforeEach(async () => {
  await User.deleteMany({}) // Add user to test since blogs have a reference to user
  const user = new User({ username: 'root', name: 'root', passwordHash: 'test' })
  await user.save()
  token = jwt.sign({ username: user.username, id: user._id }, process.env.SECRET)
  await Blog.deleteMany({})
  let blogObject = new Blog({ ...initialBlogs[0], user: user._id })
  await blogObject.save()
  blogObject = new Blog({ ...initialBlogs[1], user: user._id })
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

// Test HTTP GET to /api/blogs returns correct amount of blogs
test('all blogs are returned', async () => {
  const response = await api
  .get('/api/blogs')
  .expect(200)
  .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, 2)
})

test('identifier field is named id', async () => {
  const response = await api
  .get('/api/blogs')
  .expect(200)

  response.body.forEach(blog => {
    assert.ok(blog.id)
  })
})

// Test HTTP POST to /api/blogs creates a new blog post
test('a new blog can be added', async () => {
  const newBlog = {
    title: "Test", 
    author: "Author",
    url: "http://test.com",
    likes: 0
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

  // Check that number of blgs increases
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, 3)
})

// Test HTTP POST to /api/blogs without likes defaults to 0
test('a new blog can be added without likes', async () => {
  const newBlog = {
    title: "Test", 
    author: "Author",
    url: "http://test.com",
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

  assert.strictEqual(response.body.likes, 0)
})

test('blog cannot be added without token', async () => {
    const newBlog = {
    title: "Test", 
    author: "Author",
    url: "http://test.com",
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
})

test('blog without title or url leads to 400 Bad Request', async () => {
  const newBlog = {
    author: "Author",
    likes: 0
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test('blog that exists can be deleted', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const blogToDelete = blogsAtStart.body[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)
  
  const blogsAtEnd = await api.get('/api/blogs')
  assert.strictEqual(blogsAtEnd.body.length, blogsAtStart.body.length - 1)
})

test('blog that does not exist cannot be deleted', async () => {
  const Id = '1a111aa11b11a111111d11f1'

  await api
    .delete(`/api/blogs/${Id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(404)
})

test('blog that exists can be updated', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const blogToUpdate = blogsAtStart.body[0]

  const newBlog = {
    title: "Test", 
    author: "Author",
    url: "http://test.com",
    likes: 5
  }

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(200)

  assert.strictEqual(response.body.title, "Test")
})

test('blog that does not exist cannot be updated', async () => {
  const Id = '1a111aa11b11a111111d11f1'

  await api
    .put(`/api/blogs/${Id}`)
    .set('Authorization', `Bearer ${token}`)
    .send({ title: "Title" })
    .expect(404)
})

after(async () => {
  await mongoose.connection.close()
})