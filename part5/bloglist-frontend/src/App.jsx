import { useState, useEffect } from 'react'
import Blog from './components/Blog'

import blogService from './services/blogs'
import loginService from './services/login'

const handleLogin = (event, setUser) => {
  event.preventDefault()
  loginService.login({
    username: event.target.Username.value,
    password: event.target.Password.value
  }).then(user => {
    setUser(user)
    window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
  })
}

const handleNewBlog = (event, user, blogs, setBlogs, newTitle, setNewTitle, newAuthor, setNewAuthor, newUrl, setNewUrl) => {
  event.preventDefault()
  const newBlog = {
    title: newTitle,
    author: newAuthor,
    url: newUrl
  }
  blogService.create(newBlog, user.token).then(createdBlog => {
    setBlogs(blogs.concat(createdBlog))
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  })
}

const LoginForm = ({ onLogin }) => {
  return (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={(event) => handleLogin(event, onLogin)}>
        <div>
          username: <input type="text" name="Username" />
        </div>
        <div>
          password: <input type="password" name="Password" />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

const NewBlogForm = (props) => {
  const { user, blogs, setBlogs, newTitle, setNewTitle, newAuthor, setNewAuthor, newUrl, setNewUrl } = props
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={(event) => handleNewBlog(event, user, blogs, setBlogs, newTitle, setNewTitle, newAuthor, setNewAuthor, newUrl, setNewUrl)}>
        <div>
          title:<input value={newTitle} onChange={(event) => setNewTitle(event.target.value)} type="text" name="Title" />
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

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      // blogService.setToken(user.token) // TODO: implement.
    }
  }, [])

  if (!user) {
    return <LoginForm onLogin={setUser} />
  }
  else{
    return (
      <div>
        <h2>blogs</h2>
        <p></p>
        <p>{user.name} is logged in</p>
        <button onClick={() => {
          setUser(null)
          window.localStorage.removeItem('loggedBlogAppUser')
        }}>logout</button>
        <p></p>
        <NewBlogForm user={user} blogs={blogs} setBlogs={setBlogs} newTitle={newTitle} setNewTitle={setNewTitle} newAuthor={newAuthor} setNewAuthor={setNewAuthor} newUrl={newUrl} setNewUrl={setNewUrl} />
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    )
}
}

export default App