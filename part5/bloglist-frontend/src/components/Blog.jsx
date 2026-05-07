import { useState } from 'react'

const Blog = ({ blog, updateBlog }) => {
  const [showDetails, setShowDetails] = useState(false)

  const addLike = (event) => {
    event.preventDefault()
    const newBlog = {...blog, likes: blog.likes + 1 }
    newBlog.user = blog.user.id // Pass ID instead of full user object to backend
    updateBlog(newBlog)
    newBlog.user = blog.user // Restore full user object for frontend state
  }

  return (
    <div>
      {blog.title} {blog.author}
      <button onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? 'hide details' : 'show details'}
      </button>
      {showDetails && (
        <div>
          <p>{blog.url}</p>
          {blog.likes} likes <button onClick={addLike}>like</button>
          <p>{blog.user.name}</p>
        </div>
      )}
      <p></p>
    </div>
  )
}

export default Blog