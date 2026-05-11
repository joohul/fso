import { useState, useEffect, useRef } from "react";
//import Blog from './components/Blog'

import blogService from "./services/blogs";
import loginService from "./services/login";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

import SuccessNotification from "./components/SuccessNotification";
import ErrorNotification from "./components/ErrorNotification";
import Togglable from "./components/Togglable";

import LoginForm from "./components/LoginForm";
import NewBlogForm from "./components/NewBlogForm";
import BlogView from "./components/BlogView";

import ErrorBoundary from "./components/ErrorBoundary";

import { create } from "zustand";

import { AppBar, Button, Container, Toolbar, Typography } from "@mui/material";

const useNotificationStore = create((set) => ({
  successMessage: null,
  errorMessage: null,
  showSuccess: (message) => {
    set({ successMessage: message });
    setTimeout(() => {
      set({ successMessage: null });
    }, 5000);
  },
  showError: (message) => {
    set({ errorMessage: message });
    setTimeout(() => {
      set({ errorMessage: null });
    }, 5000);
  },
}));

const AppContent = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
    }
  }, []);

  const showError = (message) => {
    useNotificationStore.getState().showError(message);
  };

  const showSuccess = (message) => {
    useNotificationStore.getState().showSuccess(message);
  };

  const successMessage = useNotificationStore((state) => state.successMessage);
  const errorMessage = useNotificationStore((state) => state.errorMessage);

  const handleLogin = (event, setUser) => {
    event.preventDefault();
    loginService
      .login({
        username: event.target.Username.value,
        password: event.target.Password.value,
      })
      .then((user) => {
        setUser(user);
        window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
        showSuccess("login successful");
        navigate("/");
      })
      .catch(() => {
        showError("wrong username or password");
      });
  };

  const handleNewBlog = (newBlog) => {
    blogService.create(newBlog, user.token).then((createdBlog) => {
      // Ensure the created blog includes the current user object so UI updates immediately
      createdBlog.user = user;
      setBlogs(blogs.concat(createdBlog));
      showSuccess(
        `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
      );
      //blogFormRef.current.toggleVisibility()
      navigate("/");
    });
  };

  const handleUpdateBlog = (updatedBlog) => {
    const blogUser = blogs.find((blog) => blog.id === updatedBlog.id)?.user; // Find the user from the current state of blogs
    blogService
      .update(updatedBlog.id, updatedBlog, user.token)
      .then((returnedBlog) => {
        returnedBlog.user = blogUser; // Restore the user information in the returned blog
        setBlogs(
          blogs.map((blog) =>
            blog.id === returnedBlog.id ? returnedBlog : blog,
          ),
        );
      });
  };

  const handleRemoveBlog = (blogId) => {
    blogService.deleteBlog(blogId, user.token).then(() => {
      setBlogs(blogs.filter((blog) => blog.id !== blogId));
      showSuccess("blog removed successfully");
      navigate("/");
    });
  };

  return (
    <div>
      <AppBar
        position="static"
        elevation={0}
        color="transparent"
        sx={{ mb: 2 }}
      >
        <Toolbar sx={{ gap: 1, flexWrap: "wrap" }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            bloglist
          </Typography>
          <Button component={Link} to="/" color="inherit">
            home
          </Button>
          {user && (
            <Button component={Link} to="/create" color="inherit">
              create new
            </Button>
          )}
          {user ? (
            <Button
              color="inherit"
              onClick={() => {
                setUser(null);
                window.localStorage.removeItem("loggedBlogAppUser");
                showSuccess("logged out");
                navigate("/");
              }}
            >
              logout
            </Button>
          ) : (
            <Button component={Link} to="/login" color="inherit">
              login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <ErrorBoundary>
        <div>
          <SuccessNotification message={successMessage} />
          <ErrorNotification message={errorMessage} />
        </div>

        <Routes>
          <Route
            path="/login"
            element={<LoginForm onLogin={setUser} handleLogin={handleLogin} />}
          />
          <Route
            path="/"
            element={
              <div>
                <h2>blogs</h2>
                {blogs
                  .sort((a, b) => b.likes - a.likes)
                  .map((blog) => (
                    <div key={blog.id}>
                      <Link to={`/blogs/${blog.id}`}>
                        {blog.title} {blog.author}
                      </Link>
                    </div>
                  ))}
              </div>
            }
          />
          <Route
            path="/blogs/:id"
            element={
              <BlogView
                blogs={blogs}
                user={user}
                handleUpdateBlog={handleUpdateBlog}
                handleRemoveBlog={handleRemoveBlog}
              />
            }
          />
          <Route
            path="/create"
            element={<NewBlogForm createBlog={handleNewBlog} />}
          />
          <Route
            path="*"
            element={
              <div>
                <h2>404 - page not found</h2>
              </div>
            }
          />
        </Routes>
      </ErrorBoundary>
    </div>
  );
};

const App = () => {
  return (
    <Container>
      <Router>
        <AppContent />
      </Router>
    </Container>
  );
};

export default App;
