import React, { useEffect } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import NewBlogForm from './components/NewBlogForm'
import LoginForm from './components/LoginForm'
import { setNotification } from './reducers/notificationReducer'
import { addBlog, deleteBlog, likeBlog, initializeBlogs } from './reducers/blogsReducer'
import { tryLoginByToken, logout } from './reducers/userReducer'

import { useDispatch, useSelector } from 'react-redux'

import {
  Container,
  Typography,
  Button,
  List,
  Paper,
  Divider
} from '@material-ui/core'

const Notification = ({ notification }) => {
  return(
    notification !== null &&
    <p style={{ backgroundColor: 'grey' }}><b>{notification}</b></p>
  )
}

const App = () => {

  const dispatch = useDispatch()

  const user = useSelector(state => state.user)
  const notification = useSelector(state => state.notification.text)
  const blogs = useSelector(state => state.blogs)

  const createBlogRef = React.createRef()

  const handleLogout = () => {
    dispatch(logout())
  }

  const handleBlogCreated = (createdBlog) => {
    createBlogRef.current.toggleVisibility()
    try {
      dispatch(addBlog(createdBlog))
      dispatch(setNotification('Blog added succesfully!'))
    } catch (error) {
      dispatch(setNotification('Something went wrong and the blog was not added'))
    }
  }

  useEffect(() => {
    dispatch(tryLoginByToken())
  }, [dispatch])

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  const handleBlogLiked = (blog) => {
    dispatch(likeBlog(blog))
  }

  const handleBlogDeleted = async (blog) => {

    if (window.confirm(`Removing blog ${blog.title} by ${blog.author}`)) {
      dispatch(deleteBlog(blog))
    }
  }

  return (
    <Container maxWidth="md">
      <Typography variant='h1'>blogs</Typography>

      <Notification notification={notification}/>

      {
        user === null &&
        <Togglable buttonLabel='login'>
          <LoginForm/>
        </Togglable>
      }


      {
        user !== null &&
        <div id='logged-user-content'>
          <Typography variant='body1'
          >{user.name} logged in <Button variant='outlined' size='small' onClick={handleLogout}>logout</Button></Typography>
          <Togglable buttonLabel='add blog' ref={createBlogRef}>
            <NewBlogForm onBlogSubmitted={handleBlogCreated}></NewBlogForm>
          </Togglable>
        </div>
      }

      <List component={Paper}>
        {blogs.map((blog, i) =>
          <div key={blog.id}>

            <Blog blog={blog} onLiked={handleBlogLiked} onDeleted={handleBlogDeleted} />
            { i===blogs.length - 1 ? null : <Divider/> }
          </div>
        )}
      </List>

    </Container>
  )
}

export default App