import { beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'

vi.mock('../store', async () => {
  const actual = await vi.importActual('../store')

  return {
    ...actual,
    useAnecdoteActions: vi.fn(),
    useSetNotification: vi.fn(),
  }
})

import useAnecdoteStore, { setFilter, useAnecdoteActions, useSetNotification } from '../store'
import AnecdoteList from './AnecdoteList'

beforeEach(() => {
  cleanup()
  useAnecdoteStore.setState({ anecdotes: [], filter: '' })
  vi.clearAllMocks()
  useAnecdoteActions.mockReturnValue({
    vote: vi.fn(),
    delete: vi.fn(),
  })
  useSetNotification.mockReturnValue(vi.fn())
})

describe('AnecdoteList', () => {
  it('renders anecdotes sorted by votes', () => {
    useAnecdoteStore.setState({
      anecdotes: [
        { id: 1, content: 'abcde', votes: 1 },
        { id: 2, content: 'qwerty', votes: 5 },
        { id: 3, content: '123456', votes: 3 },
      ],
      filter: '',
    })

    const { container } = render(<AnecdoteList />)

    const renderedAnecdotes = Array.from(container.querySelectorAll('.content'))
      .map((element) => element.textContent)

    expect(renderedAnecdotes[0]).toEqual('qwerty')
    expect(renderedAnecdotes[1]).toEqual('123456')
    expect(renderedAnecdotes[2]).toEqual('abcde')
  })

  it('increases votes when vote is clicked', async () => {
    useAnecdoteStore.setState({
      anecdotes: [
        { id: 1, content: 'abcde', votes: 1 },
      ],
      filter: '',
    })

    useAnecdoteActions.mockReturnValue({
      vote: vi.fn(async (id) => {
        useAnecdoteStore.setState((state) => ({
          anecdotes: state.anecdotes.map((anecdote) =>
            anecdote.id === id ? { ...anecdote, votes: anecdote.votes + 1 } : anecdote
          ),
        }))
      }),
      delete: vi.fn(),
    })

    render(<AnecdoteList />)

    fireEvent.click(screen.getByText('vote'))

    await waitFor(() => {
      expect(screen.getByText(/has 2 votes/)).toBeDefined()
    })
  })

  it('renders only the anecdotes that match the filter', () => {
    useAnecdoteStore.setState({
      anecdotes: [
        { id: 1, content: 'abcde', votes: 1 },
        { id: 2, content: 'qwerty', votes: 5 },
        { id: 3, content: '123456', votes: 3 },
      ],
      filter: '',
    })

    setFilter('123')
    const { container } = render(<AnecdoteList />)

    const renderedAnecdotes = Array.from(container.querySelectorAll('.content'))
      .map((element) => element.textContent)

    expect(renderedAnecdotes).toEqual(['123456'])
  })
})