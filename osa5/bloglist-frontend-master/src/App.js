import React, { useState, useEffect, useImperativeHandle } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const BLOG_USER_KEY = 'blogUser'


// This differs a bit from the example as the actual login request is
// also done in this component.
const LoginForm = ({ onUserLoggedIn, setNotification }) => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()

    const credentials =
      {
        username,
        password
      }

    try {
      const user = await loginService.login(credentials)
      setUsername('')
      setPassword('')
      onUserLoggedIn(user)
      setNotification(`Hi ${user.name}!`)

    } catch (error) {
      if (error.message === 'Request failed with status code 401') {
        setNotification('Invalid credentials')
     } else {
       setNotification('Could not log in, check network connection')
     }
    }

  }

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
    </div>
  )
}

const NewBlogForm = ({ onBlogCreated, setNotification }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const blog = await blogService.create({ title, author, url })

      setTitle('')
      setAuthor('')
      setUrl('')
      onBlogCreated(blog)
      setNotification('Blog added succesfully!')
    } catch (error) {
      setNotification('Something went wrong and the blog was not added')
    }
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>title:
          <input
              type="text"
              value={title}
              name="Title"
              onChange={({ target }) => setTitle(target.value)}/>
        </div>
        <div>author:
          <input
              type="text"
              value={author}
              name="Author"
              onChange={({ target }) => setAuthor(target.value)}/>
        </div>
        <div>url:
          <input
              type="text"
              value={url}
              name="Url"
              onChange={({ target }) => setUrl(target.value)}/>
        </div>
        <button type="submit">create</button>

      </form>
    </>
  )
}

const Togglable = React.forwardRef((props, ref) => {

  useImperativeHandle(ref, () => {
    return {toggleVisibility}
  })

  const [visible, setVisible] = useState(false)

  const toggleVisibility = () =>{ setVisible(!visible) }

  const content = (
    <>
      {props.children}
      <button onClick={()=>setVisible(false)}>cancel</button>
    </>
  )

  const hidden = <button onClick={()=>setVisible(true)}>{props.buttonLabel}</button>

  return (
    visible ? content : hidden
  )
})

const Notification = ({notification}) => {
  return(
    notification !== null &&
    <p style={ {backgroundColor: 'grey'} }><b>{notification}</b></p>
  )
  }

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const createBlogRef = React.createRef()

  const login = user => {
    window.localStorage.setItem(BLOG_USER_KEY, JSON.stringify(user))
    blogService.setToken(user.token)
    setUser(user)
  }

  const handleLogout = () => {
    window.localStorage.removeItem(BLOG_USER_KEY)
    setUser(null)
  }

  const handleBlogCreated = async (blog) => {
    createBlogRef.current.toggleVisibility()
    setBlogs(blogs.concat(blog))
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(BLOG_USER_KEY)
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      login(user)
    }

  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  // Use effect hook once again to avoid memory leaks
  useEffect(() => {
    const clearNotification = () => setNotification(null)
    const timer = setTimeout(clearNotification, 5000)

    return () => clearInterval(timer)
  }, [notification])


  return (
    <div>
      <h2>blogs</h2>

      <Notification notification={notification}/>

      {
        user === null &&
        <Togglable buttonLabel='login'>
          <LoginForm onUserLoggedIn={login} setNotification={setNotification}/>
        </Togglable>
      }


      {
        user !== null &&
        <>
          <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
          <Togglable buttonLabel='add blog' ref={createBlogRef}>
            <NewBlogForm onBlogCreated={handleBlogCreated} setNotification={setNotification}></NewBlogForm>
          </Togglable>
        </>
      }

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}


    </div>
  )
}

export default App