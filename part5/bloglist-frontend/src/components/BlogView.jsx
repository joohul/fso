import { useParams, Link } from 'react-router-dom'
import React from 'react'
import { Box, Button, Paper, Stack, Typography } from '@mui/material'

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
    const newBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id }
    handleUpdateBlog(newBlog) 
  }

  const remove = (event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      handleRemoveBlog(blog.id)
    }
  }

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h5" component="h2">
          blogs
        </Typography>
        <Box>
          <Typography variant="h6" component="h3">
            {blog.title} {blog.author}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>{blog.url}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2">{blog.likes} likes</Typography>
          {user && (
            <Button variant="contained" size="small" onClick={like}>like</Button>
          )}
        </Box>
        <Typography variant="body2">added by {blog.user?.name}</Typography>
        {(blog.user && user && blog.user.name === user.name) && (
          <Button color="error" variant="outlined" size="small" sx={{ alignSelf: 'flex-start' }} onClick={remove}>
            remove
          </Button>
        )}
      </Stack>
    </Paper>
  )
}

export default BlogView
