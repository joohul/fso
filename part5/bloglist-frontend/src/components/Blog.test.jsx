import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: 'Title',
    author: 'Author',
    url: 'URL',
    likes: 0,
    user: {
      id: '12345',
      name: 'Test User'
    }
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText('Title Author')

  expect(element).toBeDefined()
})


test('clicking the button shows additional information', async () => {
  const blog = {
    title: 'Title',
    author: 'Author',
    url: 'URL',
    likes: 0,
    user: {
      id: '12345',
      name: 'Test User'
    }
  }

  render(
    <Blog blog={blog} />
  )

  const user = userEvent.setup()
  const button = screen.getByText('show details')
  await user.click(button)

  const urlElement = screen.getByText('URL')
  const likesElement = screen.getByText('0 likes')
  const userElement = screen.getByText('Test User')
  
  expect(urlElement).toBeDefined()
  expect(likesElement).toBeDefined()
  expect(userElement).toBeDefined()
})

test('clicking the like button twice calls event handler twice', async () => {
    const blog = {
    title: 'Title',
    author: 'Author',
    url: 'URL',
    likes: 0,
    user: {
      id: '12345',
      name: 'Test User'
    }
  }

  const mockHandler = vi.fn()

  render(
    <Blog blog={blog} updateBlog={mockHandler} />
  )

  const user = userEvent.setup()
  const showDetailsButton = screen.getByText('show details')
  await user.click(showDetailsButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('blog information is displayed to unauthenticated users without action buttons', async () => {
  const blog = {
    title: 'Title',
    author: 'Author',
    url: 'URL',
    likes: 0,
    user: {
      id: '12345',
      name: 'Test User'
    }
  }

  render(<Blog blog={blog} updateBlog={vi.fn()} removeBlog={vi.fn()} />)

  const user = userEvent.setup()
  const showDetailsButton = screen.getByText('show details')
  await user.click(showDetailsButton)
  
  expect(screen.getByText('URL')).toBeDefined()
  expect(screen.getByText('0 likes')).toBeDefined()
  expect(screen.getByText('Test User')).toBeDefined()
  expect(screen.queryByText('remove')).toBeNull()
})

test('authenticated user who is not the blog creator sees only the like button', async () => {
  const blog = {
    title: 'Title',
    author: 'Author',
    url: 'URL',
    likes: 0,
    user: {
      id: '12345',
      name: 'Test User'
    }
  }

  const currentUser = {
    id: 'abcde',
    name: 'Second User'
  }

  render(<Blog blog={blog} updateBlog={vi.fn()} removeBlog={vi.fn()} user={currentUser} />)

  const user = userEvent.setup()
  const showDetailsButton = screen.getByText('show details')
  await user.click(showDetailsButton)

  expect(screen.getByText('like')).toBeDefined()
  expect(screen.queryByText('remove')).toBeNull()
})

test('blog creator sees both like button and delete button', async () => {
  const blog = {
    title: 'Title',
    author: 'Author',
    url: 'URL',
    likes: 0,
    user: {
      id: '12345',
      name: 'Creator'
    }
  }

  const currentUser = {
    id: '12345',
    name: 'Creator'
  }

  render(<Blog blog={blog} updateBlog={vi.fn()} removeBlog={vi.fn()} user={currentUser} />)

  const user = userEvent.setup()
  const showDetailsButton = screen.getByText('show details')
  await user.click(showDetailsButton)

  expect(screen.getByText('like')).toBeDefined()
  expect(screen.getByText('remove')).toBeDefined()
})

