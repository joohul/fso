const jwt = require('jsonwebtoken')
const User = require('../models/user')

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

module.exports = {
  tokenExtractor,
  userExtractor
}
