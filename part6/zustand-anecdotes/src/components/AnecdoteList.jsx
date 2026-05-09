import { useAnecdotes, useAnecdoteActions, useSetNotification } from '../store'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const actions = useAnecdoteActions()
  const setNotification = useSetNotification()
  const vote = (id) => {
    actions.vote(id)
    setNotification(`You voted '${anecdotes.find(a => a.id === id).content}'`)
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.toSorted((a, b) => b.votes - a.votes).map(anecdote => (
        <div key={anecdote.id}>
          <div className="content">{anecdote.content}</div>
          <div>
            has {anecdote.votes} votes 
            <button onClick={() => vote(anecdote.id)}>vote</button>
            {anecdote.votes == 0 && (<button onClick={() => {
              actions.delete(anecdote.id)
              setNotification(`You deleted '${anecdote.content}'`)
            }}>delete</button>)}
          </div>
        </div>
      ))}
      </div>
  )
}

export default AnecdoteList