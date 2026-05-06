const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const { resolve } = require('node:dns')

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
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
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
    .send(newBlog)
    .expect(201)

  assert.strictEqual(response.body.likes, 0)
})

after(async () => {
  await mongoose.connection.close()
})