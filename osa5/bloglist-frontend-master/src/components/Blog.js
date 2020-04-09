import React, { useState } from 'react'
import {
  ListItem,
  Button,
  Typography
} from '@material-ui/core'


const Blog = ({ blog, onLiked, onDeleted }) => {

  const [isExtended, setIsExtended] = useState(false)

  const extendedData = (
    <div>
      <Typography>{blog.url}</Typography>
      <Typography>likes: {blog.likes} <button onClick={() => onLiked(blog)}>like</button></Typography>
      <Typography>{blog.user.name}</Typography>
      <Button color='secondary' onClick={() => onDeleted(blog)}>remove</Button>
    </div>
  )

  return (
    <ListItem className='show-blog-button' button onClick={() => setIsExtended(!isExtended)}>
      <div className='blog'>
        <div>
          <Typography>{blog.title}</Typography>
          <Typography>{blog.author}</Typography>
        </div>

        {
          isExtended ?
            extendedData
            :
            null
        }
        <Typography variant='button' color='primary' onClick={() => setIsExtended(!isExtended)}>{isExtended?'hide':'show'}</Typography>
      </div>
    </ListItem>
  )
}

export default Blog
