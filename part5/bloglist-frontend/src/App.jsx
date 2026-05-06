import { useState, useEffect } from 'react'
import Blog from './components/Blog'

import blogService from './services/blogs'
import loginService from './services/login'

const handleLogin = (event, setUser) => {
  console.log('handleLogin called')
  event.preventDefault()
  console.log('logging in with', event.target.Username.value, event.target.Password.value)
  loginService.login({
    username: event.target.Username.value,
    password: event.target.Password.value
  }).then(user => {
    console.log('logged in user:', user)
    setUser(user)
  })
}

const App = () => {
  console.log('App component rendered')
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
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
        <p></p>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    )
}
}

export default App