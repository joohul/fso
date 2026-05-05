const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (request, response) => {
  return JSON.stringify(request.body)
})
// Replaced tiny with format that shows body of POST requests
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let data = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": "1"
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": "2"
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": "3"
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": "4"
    }
]

app.get("/api/persons", (request, response) => {
  response.json(data)
})

app.get("/info", (request, response) => {
  const now = new Date()
  response.send(
    `<p>Phonebook has info for ${data.length} people</p><p>${now}</p>`
  )
})

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id
  const person = data.find(p => p.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id
  data = data.filter(p => p.id !== id)
  response.status(204).end()
})

app.post("/api/persons", (request, response) => {
  const body = request.body
  if (!body.name) {
    return response.status(400).json({ error: "name missing" })
  }
  if (!body.number) {
    return response.status(400).json({ error: "number missing" })
  }
  if (data.find(p => p.name === body.name)) {
    return response.status(400).json({ error: "name must be unique" })
  }
  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 9999999999).toString()
  }
  data = data.concat(person)
  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})