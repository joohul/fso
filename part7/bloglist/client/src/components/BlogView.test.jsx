import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import BlogView from "./BlogView";
import blogService from "../services/blogs";
import { useBlogStore, useUserStore } from "../store";

vi.mock("../services/blogs", () => ({
  default: {
    update: vi.fn().mockResolvedValue({}),
    deleteBlog: vi.fn().mockResolvedValue({}),
  },
}));

const resetStore = () => {
  useBlogStore.setState({ blogs: [] });
  useUserStore.setState({ currentUser: null });
};

test("renders content", () => {
  resetStore();
  const blog = {
    title: "Title",
    author: "Author",
    url: "URL",
    id: "12345",
    likes: 0,
    user: {
      id: "12345",
      name: "Test User",
    },
  };

  useBlogStore.setState({ blogs: [blog] });

  render(
    <MemoryRouter initialEntries={[`/blogs/${blog.id}`]}>
      <Routes>
        <Route path="/blogs/:id" element={<BlogView />} />
      </Routes>
    </MemoryRouter>,
  );

  const element = screen.getByText("Title Author");

  expect(element).toBeDefined();
});

test("clicking the button shows additional information", async () => {
  resetStore();
  const blog = {
    title: "Title",
    author: "Author",
    url: "URL",
    id: "12345",
    likes: 0,
    user: {
      id: "12345",
      name: "Test User",
    },
  };
  useBlogStore.setState({ blogs: [blog] });

  render(
    <MemoryRouter initialEntries={[`/blogs/${blog.id}`]}>
      <Routes>
        <Route path="/blogs/:id" element={<BlogView />} />
      </Routes>
    </MemoryRouter>,
  );

  expect(screen.getByText("URL")).toBeDefined();
  expect(screen.getByText("0 likes")).toBeDefined();
  expect(screen.getByText(/Test User/)).toBeDefined();
});

test("clicking the like button twice calls event handler twice", async () => {
  resetStore();
  const blog = {
    title: "Title",
    author: "Author",
    url: "URL",
    id: "12345",
    likes: 0,
    user: {
      id: "12345",
      name: "Test User",
    },
  };

  const currentUser = { id: "someone", name: "Some User" };
  useBlogStore.setState({ blogs: [blog] });
  useUserStore.setState({ currentUser });

  render(
    <MemoryRouter initialEntries={[`/blogs/${blog.id}`]}>
      <Routes>
        <Route path="/blogs/:id" element={<BlogView />} />
      </Routes>
    </MemoryRouter>,
  );

  const user = userEvent.setup();
  const likeButton = screen.getByText("like");
  await user.click(likeButton);
  await user.click(likeButton);

  expect(blogService.update).toHaveBeenCalledTimes(2);
});

test("blog information is displayed to unauthenticated users without action buttons", async () => {
  resetStore();
  const blog = {
    title: "Title",
    author: "Author",
    url: "URL",
    id: "12345",
    likes: 0,
    user: {
      id: "12345",
      name: "Test User",
    },
  };
  useBlogStore.setState({ blogs: [blog] });

  render(
    <MemoryRouter initialEntries={[`/blogs/${blog.id}`]}>
      <Routes>
        <Route path="/blogs/:id" element={<BlogView />} />
      </Routes>
    </MemoryRouter>,
  );

  expect(screen.getByText("URL")).toBeDefined();
  expect(screen.getByText("0 likes")).toBeDefined();
  expect(screen.getByText(/Test User/)).toBeDefined();
  expect(screen.queryByText("remove")).toBeNull();
});

test("authenticated user who is not the blog creator sees only the like button", async () => {
  resetStore();
  const blog = {
    title: "Title",
    author: "Author",
    url: "URL",
    id: "12345",
    likes: 0,
    user: {
      id: "12345",
      name: "Test User",
    },
  };

  const currentUser = {
    id: "abcde",
    name: "Second User",
  };
  useBlogStore.setState({ blogs: [blog] });
  useUserStore.setState({ currentUser });

  render(
    <MemoryRouter initialEntries={[`/blogs/${blog.id}`]}>
      <Routes>
        <Route path="/blogs/:id" element={<BlogView />} />
      </Routes>
    </MemoryRouter>,
  );

  expect(screen.getByText("like")).toBeDefined();
  expect(screen.queryByText("remove")).toBeNull();
});

test("blog creator sees both like button and delete button", async () => {
  resetStore();
  const blog = {
    title: "Title",
    author: "Author",
    url: "URL",
    id: "12345",
    likes: 0,
    user: {
      id: "12345",
      name: "Creator",
    },
  };

  const currentUser = {
    id: "12345",
    name: "Creator",
  };
  useBlogStore.setState({ blogs: [blog] });
  useUserStore.setState({ currentUser });

  render(
    <MemoryRouter initialEntries={[`/blogs/${blog.id}`]}>
      <Routes>
        <Route path="/blogs/:id" element={<BlogView />} />
      </Routes>
    </MemoryRouter>,
  );

  expect(screen.getByText("like")).toBeDefined();
  expect(screen.getByText("remove")).toBeDefined();
});
