import { create } from 'zustand'
import anecdoteService from './services/anecdotes'

const useAnecdoteStore = create((set) => ({
  filter: '',
  anecdotes: [],
  actions: {
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll()
      set({ anecdotes })
    },

    vote: async (id) => {
      const anecdoteToVote = useAnecdoteStore.getState().anecdotes.find((a) => a.id === id)
      const updatedAnecdote = await anecdoteService.vote(anecdoteToVote)

      set((state) => ({
        anecdotes: state.anecdotes.map((a) =>
          a.id === id ? updatedAnecdote : a
        )
      }))
    },

    add: async (content) => {
      const savedAnecdote = await anecdoteService.create(content)

      set((state) => ({
        anecdotes: [...state.anecdotes, savedAnecdote]
      }))
    },

    delete: async (id) => {
      await anecdoteService.remove(id)

      set((state) => ({
        anecdotes: state.anecdotes.filter((a) => a.id !== id)
      }))
    }
  }
}))

const useNotificationStore = create((set) => ({
  notification: null,
  setNotification: (message) => {
    set({ notification: message })
    setTimeout(() => set({ notification: null }), 5000)
  }
}))

export const useNotification = () => useNotificationStore((state) => state.notification)
export const useSetNotification = () => useNotificationStore((state) => state.setNotification)

export const setFilter = (filter) => useAnecdoteStore.setState({ filter })
export const useAnecdotes = () => {
  const filter = useAnecdoteStore((state) => state.filter)
  const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  if (filter === '') return anecdotes
  return anecdotes.filter(a => a.content.toLowerCase().includes(filter.toLowerCase()))
}
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)

export default useAnecdoteStore
