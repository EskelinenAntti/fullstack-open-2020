import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { login } from '../reducers/userReducer'
import {
  Typography,
  Button
} from '@material-ui/core'

const LoginForm = () => {

  const dispatch = useDispatch()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()

    const credentials =
      {
        username,
        password
      }

    dispatch(login(credentials))
    setUsername('')
    setPassword('')

  }

  return (
    <div>
      <Typography variant='h2'>Log in to application</Typography>
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
        <Button id='login-button' type='submit'>login</Button>
      </form>
    </div>
  )
}

// This is no longer required after refactoring to using redux.
/*
LoginForm.propTypes = {
  onUserLoggedIn: PropTypes.func.isRequired
}
*/

export default LoginForm