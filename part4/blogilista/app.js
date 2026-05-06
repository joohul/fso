//const config = require('./utils/config')
const Blog = require('./models/blog')
const User = require('./models/user')
const jwt = require('jsonwebtoken')
const express = require('express')
const app = express()
app.use(express.json())

const tokenExtractor = (request, response, next) => {
	const authorization = request.get('authorization')
	if (authorization && authorization.startsWith('Bearer ')) {
		request.token = authorization.replace('Bearer ', '')
	}
	next()
}

const userExtractor = async (request, response, next) => {
	if (request.token) {
		try {
			const decodedToken = jwt.verify(request.token, process.env.SECRET)
			if (decodedToken.id) {
				request.user = await User.findById(decodedToken.id)
			}
		} catch (error) {
			// Can't find user for some reason.
      request.user = null
		}
	}
	next()
}

app.use(tokenExtractor)

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

app.use('/api/blogs', userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)


module.exports = app