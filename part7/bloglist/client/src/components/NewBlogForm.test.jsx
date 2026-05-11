import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NewBlogForm from "./NewBlogForm";
import blogService from "../services/blogs";
import { useBlogStore, useUserStore } from "../store";

vi.mock("../services/blogs", () => ({
  default: {
    create: vi.fn().mockResolvedValue({
      title: "Title",
      author: "Author",
      url: "URL",
      id: "12345",
      user: { id: "123", name: "Test User" },
    }),
  },
}));

const resetStore = () => {
  useBlogStore.setState({ blogs: [] });
  useUserStore.setState({ currentUser: null });
};

test("new blog form calls event handler with correct details", async () => {
  resetStore();
  useUserStore.setState({
    currentUser: { id: "123", name: "Test User", token: "token" },
  });

  render(<NewBlogForm />);

  const user = userEvent.setup();
  const inputs = screen.getAllByRole("textbox");

  await user.type(inputs[0], "Title");
  await user.type(inputs[1], "Author");
  await user.type(inputs[2], "URL");

  const sendButton = screen.getByText("create");
  await user.click(sendButton);

  expect(blogService.create).toHaveBeenCalledWith(
    { title: "Title", author: "Author", url: "URL" },
    "token",
  );
});
