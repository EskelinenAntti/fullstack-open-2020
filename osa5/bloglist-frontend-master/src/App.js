import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import NewBlogForm from './components/NewBlogForm'
import LoginForm from './components/LoginForm'
import { setNotification } from './reducers/notificationReducer'

import { useDispatch, useSelector } from 'react-redux'

import blogService from './services/blogs'

const BLOG_USER_KEY = 'blogUser'

const Notification = ({ notification }) => {
  return(
    notification !== null &&
    <p style={{ backgroundColor: 'grey' }}><b>{notification}</b></p>
  )
}

const App = () => {

  const dispatch = useDispatch()

  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  // const [notification, setNotification] = useState(null)
  const notification = useSelector(state => state.notification.text)
  const createBlogRef = React.createRef()

  const login = user => {
    window.localStorage.setItem(BLOG_USER_KEY, JSON.stringify(user))
    blogService.setToken(user.token)
    setUser(user)
  }

  const sortBlogs = (blogs) => (
    blogs.sort((f,s) =>  s.likes - f.likes)
  )

  const handleLogout = () => {
    window.localStorage.removeItem(BLOG_USER_KEY)
    setUser(null)
  }

  const handleBlogCreated = async (createdBlog) => {
    createBlogRef.current.toggleVisibility()
    try {
      const blog = await blogService.create(createdBlog)
      blog.user = { ...user }
      dispatch(setNotification('Blog added succesfully!'))
      setBlogs(blogs.concat(blog))
    } catch (error) {
      dispatch(setNotification('Something went wrong and the blog was not added'))
    }
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(BLOG_USER_KEY)
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      login(user)
    }

  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs => {
      sortBlogs( blogs )
      setBlogs( blogs )
    }
    )
  }, [])

  const handleBlogLiked = async (blog) => {
    blog.likes += 1
    const resultBlog = await blogService.update(blog)

    const updatedBlogs = blogs.map(
      blog => blog.id === resultBlog.id ? resultBlog : blog)

    sortBlogs(updatedBlogs)
    setBlogs(updatedBlogs)
  }

  const handleBlogDeleted = async (blog) => {

    if (window.confirm(`Removing blog ${blog.title} by ${blog.author}`)) {
      await blogService.remove(blog)
      const updatedBlogs = blogs.filter(b => b.id !== blog.id)
      setBlogs(updatedBlogs)
    }
  }

  return (
    <div>
      <h2>blogs</h2>

      <Notification notification={notification}/>

      {
        user === null &&
        <Togglable buttonLabel='login'>
          <LoginForm onUserLoggedIn={login}/>
        </Togglable>
      }


      {
        user !== null &&
        <div id='logged-user-content'>
          <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
          <Togglable buttonLabel='add blog' ref={createBlogRef}>
            <NewBlogForm onBlogSubmitted={handleBlogCreated}></NewBlogForm>
          </Togglable>
        </div>
      }

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} onLiked={handleBlogLiked} onDeleted={handleBlogDeleted} />
      )}


    </div>
  )
}

export default App