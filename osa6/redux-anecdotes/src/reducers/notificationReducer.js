
export const setNotification = (notification) => {
  return {
    type: 'SET_NOTIFICATION',
    data: { notification }
  }
}

export const clearNotification = (notification) => {
  return {
    type: 'CLEAR_NOTIFICATION'
  }
}

const notificationReducer = (state = 'welcome', action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.data.notification
    case 'CLEAR_NOTIFICATION':
      return ''
    default:
      return state
  }
}

export default notificationReducer