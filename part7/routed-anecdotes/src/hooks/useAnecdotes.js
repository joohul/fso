import { useState, useEffect } from 'react'
import anecdoteService from '../services/anecdotes'

export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([])

  useEffect(() => {
    anecdoteService.getAll().then(data => setAnecdotes(data))
  }, [])

  const addAnecdote = (anecdote) => {
    anecdoteService.createNew(anecdote).then(newAnecdote => {
      setAnecdotes(anecdotes.concat(newAnecdote))
    })
  }

  const deleteAnecdote = (id) => {
    anecdoteService.deleteAnecdote(id).then(() => {
      setAnecdotes(anecdotes.filter(a => a.id !== id))
    })
  }

  return { anecdotes, addAnecdote, deleteAnecdote }
}
