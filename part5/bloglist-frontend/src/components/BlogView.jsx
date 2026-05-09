import { useParams, Link } from 'react-router-dom'
import React from 'react'

const BlogView = ({ blogs, user, handleUpdateBlog, handleRemoveBlog }) => {
  const { id } = useParams()
  const blog = blogs.find(b => b.id === id)
  const padding = { padding: 5 }

  if (!blog) {
    return (
      <div>
        <h2>blog not found</h2>
        <Link style={padding} to="/">back</Link>
      </div>
    )
  }

  const like = (event) => {
    event.preventDefault()
    const newBlog = { ...blog, likes: blog.likes + 1 }
    handleUpdateBlog(newBlog)
  }

  const remove = (event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      handleRemoveBlog(blog.id)
    }
  }

  return (
    <div>
      <h2>{blog.title} {blog.author}</h2>
      <p>{blog.url}</p>
      <p>{blog.likes} likes <button onClick={like}>like</button></p>
      <p>added by {blog.user?.name}</p>
      {(blog.user && user && blog.user.name === user.name) && (
        <button onClick={remove}>remove</button>
      )}
    </div>
  )
}

export default BlogView
