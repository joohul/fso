import { useAnecdotes } from "../hooks/useAnecdotes"
import { useNotify } from "../hooks/useNotify"

const AnecdoteForm = () => {
  const { addAnecdote } = useAnecdotes()
  const { showNotification } = useNotify()

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value

    if (content.length < 5) {
      showNotification('too short anecdote, must have length 5 or more')
      return
    }

    addAnecdote(content)
    event.target.reset()
    showNotification(`anecdote '${content}' created`)
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm