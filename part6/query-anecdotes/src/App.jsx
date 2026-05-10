import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'

import { useQuery } from '@tanstack/react-query'

const App = () => {
  const handleVote = (anecdote) => {
    console.log('vote')
  }

  /*
  const anecdotes = [
    {
      content: 'If it hurts, do it more often',
      id: '47145',
      votes: 0,
    },
  ]*/
  const result = useQuery({
    queryKey: ['anecdotes'],
    retry: false,
    queryFn: async () => {
      const response = await fetch('http://localhost:3001/anecdotes')
      if (!response.ok) {
        throw new Error('Failed to fetch')
      }
      return await response.json()
    }
  })
 
  console.log(JSON.parse(JSON.stringify(result)))
 
  if (result.isPending) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  } 

  const anecdotes = result.data


  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App