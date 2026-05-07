import { render, screen } from '@testing-library/react'
import { test, expect } from 'vitest'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: 'This is a title',
    author: 'This is an author',
    url: 'This is a url',
    likes: 0,
    user: {
      id: '12345',
      name: 'Test User'
    }
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText('This is a title This is an author')

  screen.debug(element)

  expect(element).toBeDefined()
})