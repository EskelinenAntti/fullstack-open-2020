import React, { useState } from 'react'

const Blog = ({ blog, onLiked, onDeleted }) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [isExtended, setIsExtended] = useState(false)

  const extendedData = (
    <div>
      {blog.url}<br/>
      likes: {blog.likes} <button onClick={() => onLiked(blog)}>like</button><br/>
      {blog.user.name}<br/>
      <button onClick={() => onDeleted(blog)}>remove</button>
    </div>
  )


  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author} <button onClick={() => setIsExtended(!isExtended)}>{isExtended?'hide':'show'}</button>
      </div>

      {
        isExtended ?
          extendedData
          :
          null
      }
    </div>
  )
}

export default Blog
