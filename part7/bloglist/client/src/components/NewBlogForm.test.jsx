import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NewBlogForm from "./NewBlogForm";

test("new blog form calls event handler with correct details", async () => {
  const createBlog = vi.fn();

  render(<NewBlogForm createBlog={createBlog} />);

  const user = userEvent.setup();
  const inputs = screen.getAllByRole("textbox");

  await user.type(inputs[0], "Title");
  await user.type(inputs[1], "Author");
  await user.type(inputs[2], "URL");

  const sendButton = screen.getByText("create");
  await user.click(sendButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: "Title",
    author: "Author",
    url: "URL",
  });
});
