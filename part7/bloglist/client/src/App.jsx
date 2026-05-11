import { useEffect, useRef } from "react";

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

import { AppBar, Button, Container, Toolbar, Typography } from "@mui/material";

import { useNotificationStore, useBlogStore, useUserStore } from "./store";

const AppContent = () => {
  // Maybe not the most elegant way to use Zustand but works well as a drop-in replacement
  const blogs = useBlogStore((state) => state.blogs);
  const setBlogs = useBlogStore((state) => state.setBlogs);
  const currentUser = useUserStore((state) => state.currentUser);
  const setCurrentUser = useUserStore((state) => state.setCurrentUser);

  const navigate = useNavigate();

  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setCurrentUser(user);
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
        setCurrentUser(user);
        window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
        showSuccess("login successful");
        navigate("/");
      })
      .catch(() => {
        showError("wrong username or password");
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
          {currentUser && (
            <Button component={Link} to="/create" color="inherit">
              create new
            </Button>
          )}
          {currentUser ? (
            <Button
              color="inherit"
              onClick={() => {
                setCurrentUser(null);
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
            element={
              <LoginForm onLogin={setCurrentUser} handleLogin={handleLogin} />
            }
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
          <Route path="/blogs/:id" element={<BlogView />} />
          <Route path="/create" element={<NewBlogForm />} />
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
