
export const setNotification = (text, timeSeconds) => {
  return async dispatch => {
    const timer = setTimeout(() => {
      dispatch(clearNotification())
    }, timeSeconds * 1000) // s -> ms
    dispatch({ type: 'SET_NOTIFICATION', data: { text, timer } })
  }
}

export const clearNotification = () => {
  return {
    type: 'CLEAR_NOTIFICATION'
  }
}

const notificationReducer = (state = { text: 'welcome', timer: null }, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      // This was not required, but is implemented for the sake of curiosity.
      // If another notification is set before previous was cleared, cancel the
      // old timeout, so the new notification is not cleared too early.
      if (state.timer !== null) {
        clearTimeout(state.timer)
      }

      return { text: action.data.text, timer: action.data.timer }
    case 'CLEAR_NOTIFICATION':
      return { text: '', timer: null }
    default:
      return state
  }
}

export default notificationReducer