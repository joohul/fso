import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useField } from '../hooks'
import { useAnecdotes } from '../hooks/useAnecdotes'

const CreateNew = () => {
  const {value: content, onChange: setContent, reset: resetContent} = useField('text')
  const {value: author, onChange: setAuthor, reset: resetAuthor} = useField('text')
  const {value: info, onChange: setInfo, reset: resetInfo} = useField('text')
  const navigate = useNavigate()

  const { addAnecdote } = useAnecdotes()

  const handleSubmit = (e) => {
    e.preventDefault()
    addAnecdote({ content, author, info, votes: 0 })
    navigate('/')
  }

  const handleReset = (e) => {
    e.preventDefault()
    resetContent()
    resetAuthor()
    resetInfo()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input name='content' value={content} onChange={setContent} />
        </div>
        <div>
          author
          <input name='author' value={author} onChange={setAuthor} />
        </div>
        <div>
          url for more info
          <input name='info' value={info} onChange={setInfo} />
        </div>
        <div>
          <button>create</button>
          <button onClick={handleReset}>reset</button>
        </div>
        
      </form>
    </div>
  )
}

export default CreateNew
