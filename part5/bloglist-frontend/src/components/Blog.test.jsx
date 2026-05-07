import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { test } from 'vitest'

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