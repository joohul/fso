import { useAnecdotes, useAnecdoteActions } from '../store'

const AnecdoteForm = () => {
  const anecdotes = useAnecdotes()
  const actions = useAnecdoteActions()
  const add = content => actions.add(content)

  const addAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    add(content)
    event.target.anecdote.value = ''
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="anecdote" />
        </div>
        <button>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
