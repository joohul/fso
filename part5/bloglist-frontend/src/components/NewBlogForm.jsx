import { useState } from 'react'

const NewBlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    const newBlog = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }
    createBlog(newBlog)
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title: <input value={newTitle} onChange={(event) => setNewTitle(event.target.value)} type="text" name="Title" />
        </div>
        <div>
          author: <input value={newAuthor} onChange={(event) => setNewAuthor(event.target.value)} type="text" name="Author" />
        </div>
        <div>
          url: <input value={newUrl} onChange={(event) => setNewUrl(event.target.value)} type="text" name="Url" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default NewBlogForm