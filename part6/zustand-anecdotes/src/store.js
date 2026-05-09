import { create } from 'zustand'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch')
  }

  const data = await response.json()
  return data
}

const initialData = getAll().then(data => {
  return data
})

const getId = () => (100000 * Math.random()).toFixed(0)

const useAnecdoteStore = create((set) => ({
  filter: '',
  anecdotes: [],
  actions: {
    vote: async (id) => {
      const anecdoteToVote = useAnecdoteStore.getState().anecdotes.find((a) => a.id === id)

      const response = await fetch(`${baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...anecdoteToVote,
          votes: anecdoteToVote.votes + 1
        })
      })

      if (!response.ok) {
        throw new Error('Failed to vote')
      }

      const updatedAnecdote = await response.json()

      set((state) => ({
        anecdotes: state.anecdotes.map((a) =>
          a.id === id ? updatedAnecdote : a
        )
      }))
    },

    add: async (content) => {
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

      const savedAnecdote = await response.json()

      set((state) => ({
        anecdotes: [...state.anecdotes, savedAnecdote]
      }))
    }
  }
}))

initialData.then((anecdotes) => {
  useAnecdoteStore.setState({ anecdotes })
})

export const setFilter = (filter) => useAnecdoteStore.setState({ filter })
export const useAnecdotes = () => {
  const filter = useAnecdoteStore((state) => state.filter)
  const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  if (filter === '') return anecdotes
  return anecdotes.filter(a => a.content.toLowerCase().includes(filter.toLowerCase()))
}
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)
