const express = require('express')
const app = express()

const morgan = require('morgan')

require('dotenv').config()
const Person = require('./models/person')

app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (request, response) => {
  return JSON.stringify(request.body)
})
// Replaced tiny with format that shows body of POST requests
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

app.get("/api/persons", (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get("/info", (request, response) => {
  const now = new Date()
  Person.countDocuments({}).then(count => {
    response.send(
      `<p>Phonebook has info for ${count} people</p><p>${now}</p>`
    )
  })
})

app.get("/api/persons/:id", (request, response, next) => {
  console.log(request.params.id)
  Person.findById(request.params.id).then(person => {
    console.log("!!!", person)
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id).then(() => {
    response.status(204).end()
  }).catch(error => next(error))
})

app.post("/api/persons", (request, response, next) => {
  const body = request.body
  if (!body.name) {
    return response.status(400).json({ error: "name missing" })
  }
  if (!body.number) {
    return response.status(400).json({ error: "number missing" })
  }
  Person.countDocuments({ name: body.name }).then(count => {
    if (count > 0) {
      return response.status(400).json({ error: "name must be unique" })
    }
  })
  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 9999999999).toString()
  }
  const newPerson = new Person({
    name: body.name,
    number: body.number
  })
  newPerson.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})