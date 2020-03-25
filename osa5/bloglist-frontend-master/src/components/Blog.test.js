import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

const blog =
  {
    author: 'Antti',
    title: 'jeejee',
    url: 'www.fi',
    likes: 1,
    user: {
      name: 'Antti Eskelinen',
      username: 'antti'
    }
  }

test('renders only title and author by default', () => {

  const component = render(
    <Blog blog={blog}/>
  )

  expect(component.container).toHaveTextContent(blog.title)
  expect(component.container).toHaveTextContent(blog.author)

  expect(component.container).not.toHaveTextContent(blog.url)
  expect(component.container).not.toHaveTextContent(blog.likes)

})

test('renders also url and likes when extended', () => {

  const component = render(
    <Blog blog={blog}/>
  )

  const button = component.getByText('show')
  fireEvent.click(button)

  expect(component.container).toHaveTextContent(blog.title)
  expect(component.container).toHaveTextContent(blog.author)

  expect(component.container).toHaveTextContent(blog.url)
  expect(component.container).toHaveTextContent(blog.likes)

})

test('like is pressed twice causes two onLiked events', () => {


  const handleOnLiked = jest.fn()
  const component = render(
    <Blog blog={blog} onLiked={handleOnLiked}/>
  )

  fireEvent.click(component.getByText('show'))

  const likeButton = component.getByText('like')
  fireEvent.click(likeButton)
  fireEvent.click(likeButton)

  expect(handleOnLiked.mock.calls.length).toBe(2)
})