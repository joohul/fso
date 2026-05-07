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

  screen.debug(element)

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