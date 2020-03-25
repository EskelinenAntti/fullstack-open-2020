import React, { useState } from 'react'
import loginService from '../services/login'
import PropTypes from 'prop-types'

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
            type='text'
            id='username'
            value={username}
            name='Username'
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            id='password'
            type='password'
            value={password}
            name='Password'
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id='login-button' type='submit'>login</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  onUserLoggedIn: PropTypes.func.isRequired
}

export default LoginForm