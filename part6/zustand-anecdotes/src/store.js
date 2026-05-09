import { create } from 'zustand'

const getAll = async () => {
  const baseUrl = 'http://localhost:3001/anecdotes'
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
    vote: (id) => set((state) => ({
      anecdotes: state.anecdotes.map((a) =>
        a.id === id ? { ...a, votes: a.votes + 1 } : a
      )
    })),
    add: (content) => set((state) => ({
      anecdotes: [...state.anecdotes, { content, id: getId(), votes: 0 }]
    }))
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
