import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'

import blogService from './services/blogs'
import loginService from './services/login'

import {
  BrowserRouter as Router,
  Routes, Route, Link, useNavigate
} from 'react-router-dom'

import SuccessNotification from './components/SuccessNotification'
import ErrorNotification from './components/ErrorNotification'
import Togglable from './components/Togglable'

import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'


const AppContent = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const navigate = useNavigate()

  const blogFormRef = useRef()

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
      navigate('/')
    }).catch(() => {
      showError('wrong username or password')
    })
  }

  const handleNewBlog = (newBlog) => {
    blogService.create(newBlog, user.token).then(createdBlog => {
      // Ensure the created blog includes the current user object so UI updates immediately
      createdBlog.user = user
      setBlogs(blogs.concat(createdBlog))
      showSuccess(`a new blog ${createdBlog.title} by ${createdBlog.author} added`)
      blogFormRef.current.toggleVisibility()
    })
  }

  const handleUpdateBlog = (updatedBlog) => {
    const blogUser = blogs.find(blog => blog.id === updatedBlog.id)?.user // Find the user from the current state of blogs
    blogService.update(updatedBlog.id, updatedBlog, user.token).then(returnedBlog => {
      returnedBlog.user = blogUser // Restore the user information in the returned blog
      setBlogs(blogs.map(blog => blog.id === returnedBlog.id ? returnedBlog : blog))
    })

  }

  const handleRemoveBlog = (blogId) => {
    blogService.deleteBlog(blogId, user.token).then(() => {
      setBlogs(blogs.filter(blog => blog.id !== blogId))
      showSuccess('blog removed successfully')
    })
  }

  const padding = {
    padding: 5
  }

  return (
    <div>
      <div>
        <Link style={padding} to="/">home</Link>
        {user
          ? <button style={padding} onClick={() => {
              setUser(null)
              window.localStorage.removeItem('loggedBlogAppUser')
              showSuccess('logged out')
              navigate('/')
            }}>logout</button>
          : <Link style={padding} to="/login">login</Link>
        }
      </div>
      <div>
        <SuccessNotification message={successMessage} />
        <ErrorNotification message={errorMessage} />
      </div>

      <Routes>
        <Route path="/login" element={
          <LoginForm onLogin={setUser} handleLogin={handleLogin} />
        } />
        <Route path="/" element={
          <div>
            <h2>blogs</h2>
            <p></p>
            {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
              <Blog key={blog.id} blog={blog} updateBlog={handleUpdateBlog} removeBlog={handleRemoveBlog} user={user} />
            )}
          </div>
        } />
      </Routes>
    </div>
  )
}

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App