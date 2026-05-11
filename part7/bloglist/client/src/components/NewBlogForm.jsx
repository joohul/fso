import { useState } from "react";
import { Button, TextField } from "@mui/material";

const NewBlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const addBlog = (event) => {
    event.preventDefault();
    const newBlog = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    };
    createBlog(newBlog);
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div style={{ marginBottom: 12 }}>
          <TextField
            label="title"
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            name="Title"
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <TextField
            label="author"
            value={newAuthor}
            onChange={(event) => setNewAuthor(event.target.value)}
            name="Author"
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <TextField
            label="url"
            value={newUrl}
            onChange={(event) => setNewUrl(event.target.value)}
            name="Url"
          />
        </div>
        <Button type="submit" variant="contained">
          create
        </Button>
      </form>
    </div>
  );
};

export default NewBlogForm;
