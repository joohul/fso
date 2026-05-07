import { useState, useEffect } from 'react'
import Blog from './components/Blog'

import blogService from './services/blogs'
import loginService from './services/login'

import SuccessNotification from './components/SuccessNotification'
import ErrorNotification from './components/ErrorNotification'

import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

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

    const showError = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const showSuccess = (message) => {
    setSuccessMessage(message)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
  }

  const handleLogin = (event, setUser) => {
    event.preventDefault()
    loginService.login({
      username: event.target.Username.value,
      password: event.target.Password.value
    }).then(user => {
      setUser(user)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      showSuccess('login successful')
    }).catch(() => {
      showError('wrong username or password')
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
    showSuccess(`a new blog ${createdBlog.title} by ${createdBlog.author} added`)
  })
  }

  if (!user) {
    return (
    <div>
        <SuccessNotification message={successMessage} />
        <ErrorNotification message={errorMessage} />
      <LoginForm onLogin={setUser} handleLogin={handleLogin} />
    </div>
    )
  }
  else{
    return (
      <div>
        <SuccessNotification message={successMessage} />
        <ErrorNotification message={errorMessage} />
        <h2>blogs</h2>
        <p></p>
        <p>{user.name} is logged in</p>
        <button onClick={() => {
          setUser(null)
          window.localStorage.removeItem('loggedBlogAppUser')
          showSuccess('logged out')
        }}>logout</button>
        <p></p>
        <NewBlogForm handleNewBlog={handleNewBlog} user={user} blogs={blogs} setBlogs={setBlogs} newTitle={newTitle} setNewTitle={setNewTitle} newAuthor={newAuthor} setNewAuthor={setNewAuthor} newUrl={newUrl} setNewUrl={setNewUrl} />
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    )
}
}

export default App