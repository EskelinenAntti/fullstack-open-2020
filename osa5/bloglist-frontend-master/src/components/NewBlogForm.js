import React, { useState } from 'react'
import PropTypes from 'prop-types'

const NewBlogForm = ({ onBlogSubmitted }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    setTitle('')
    setAuthor('')
    setUrl('')
    onBlogSubmitted({ title, author, url })
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>title:
          <input
            id='title'
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}/>
        </div>
        <div>author:
          <input
            id='author'
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}/>
        </div>
        <div>url:
          <input
            id='url'
            type="text"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}/>
        </div>
        <button type="submit" id='create-blog-button'>create</button>

      </form>
    </>
  )
}

NewBlogForm.propTypes = {
  onBlogSubmitted: PropTypes.func.isRequired
}

export default NewBlogForm