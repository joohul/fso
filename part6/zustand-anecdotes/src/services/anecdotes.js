const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch')
  }

  return response.json()
}

const create = async (content) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content, votes: 0 })
  })

  if (!response.ok) {
    throw new Error('Failed to create anecdote')
  }

  return response.json()
}

const vote = async (anecdote) => {
  const response = await fetch(`${baseUrl}/${anecdote.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...anecdote,
      votes: anecdote.votes + 1
    })
  })

  if (!response.ok) {
    throw new Error('Failed to vote')
  }

  return response.json()
}

const remove = async (id) => {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: 'DELETE'
  })

  if (!response.ok) {
    throw new Error('Failed to delete anecdote')
  }

  return response
}

const anecdoteService = {
  getAll,
  create,
  vote,
  remove,
}

export default anecdoteService