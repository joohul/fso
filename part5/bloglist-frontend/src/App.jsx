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

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

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
    console.log('no user logged in')
    return (
      <div>
        <h2>log in to application</h2>
        <form onSubmit={(event) => handleLogin(event, setUser)}>
          <div>
            <input type="text" name="Username" />
          </div>
          <div>
            <input type="password" name="Password" />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
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
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    )
}
}

export default App