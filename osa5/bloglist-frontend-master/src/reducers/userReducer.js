
import loginService from '../services/login'
import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

const BLOG_USER_KEY = 'blogUser'


export const login = (credentials) => {
  return async dispatch => {

    try {

      const user = await loginService.login(credentials)

      dispatch({
        type: 'SET_USER',
        data: { user }
      })
      dispatch(setNotification(`Hi ${user.name}!`))
      storeToken(user)

    } catch (error) {
      if (error.message === 'Request failed with status code 401') {
        dispatch(setNotification('Invalid credentials'))
      } else {
        dispatch(setNotification('Could not log in, check network connection'))
      }
    }
  }
}

export const tryLoginByToken = () => {
  return async dispatch => {
    const loggedUserJSON = window.localStorage.getItem(BLOG_USER_KEY)
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      storeToken(user)
      dispatch( {
        type: 'SET_USER',
        data: { user }
      })
    }
  }
}

export const logout = () => {
  window.localStorage.removeItem(BLOG_USER_KEY)
  return {
    type: 'LOGOUT'
  }
}

const storeToken = (user) => {
  window.localStorage.setItem(BLOG_USER_KEY, JSON.stringify(user))
  blogService.setToken(user.token)
}

const userReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.data.user
    case 'LOGOUT':
      return null
    default:
      return state
  }
}

export default userReducer