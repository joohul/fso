const NewBlogForm = (props) => {
  const { handleNewBlog, user, blogs, setBlogs, newTitle, setNewTitle, newAuthor, setNewAuthor, newUrl, setNewUrl } = props
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

export default NewBlogForm