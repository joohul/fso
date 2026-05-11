import { useState } from "react";
import { Button, TextField } from "@mui/material";
import blogService from "../services/blogs";
import { useBlogStore, useNotificationStore, useUserStore } from "../store";
import { useNavigate } from "react-router-dom";

const NewBlogForm = () => {
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const currentUser = useUserStore((state) => state.currentUser);
  const addBlog = useBlogStore((state) => state.addBlog);
  const showSuccess = useNotificationStore((state) => state.showSuccess);
  const navigate = useNavigate();

  const handleAddBlog = (event) => {
    event.preventDefault();
    const newBlog = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    };
    blogService.create(newBlog, currentUser.token).then((createdBlog) => {
      createdBlog.user = currentUser;
      addBlog(createdBlog);
      showSuccess(
        `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
      );
      setNewTitle("");
      setNewAuthor("");
      setNewUrl("");
    });
    navigate("/");
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleAddBlog}>
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
