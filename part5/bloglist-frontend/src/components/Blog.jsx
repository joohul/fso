import { useState } from 'react'


const Blog = ({ blog, updateBlog, removeBlog, user }) => {
  const [showDetails, setShowDetails] = useState(false)

  const canUserRemove = () => {
    if (!user || !blog.user) return false
    const blogUserId = typeof blog.user === 'object'
      ? (blog.user.id || blog.user._id)
      : blog.user
    const currentUserId = user.id || user._id
    return String(blogUserId) === String(currentUserId) || blog.user?.name === user.name
  }

  const addLike = (event) => {
    event.preventDefault()
    const newBlog = { ...blog, likes: blog.likes + 1 }
    newBlog.user = blog.user.id // Pass ID instead of full user object to backend
    updateBlog(newBlog)
    newBlog.user = blog.user // Restore full user object for frontend state
  }

  const deleteBlog = (event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      console.log('Deleting blog with ID:', blog.id)
      console.log('removeBlog prop:', typeof removeBlog, removeBlog)
      removeBlog(blog.id)
    }
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
          <p>{blog.user?.name}</p>
          {canUserRemove() && (<button onClick={deleteBlog}>remove</button>)}
        </div>
      )}
      <p></p>
    </div>
  )
}

export default Blog