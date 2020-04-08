

export const setNotification = text => {
  return dispatch => {
    const timer = setTimeout(
      () => dispatch(clearNotification()),
      5000
    )
    dispatch({
      type: 'SET_NOTIFICATION',
      data: { text, timer }
    })
  }
}

export const clearNotification = () => {
  return {
    type: 'CLEAR_NOTIFICATION'
  }
}

const clearTimer = (timer) => {
  if (timer) {
    clearTimeout(timer)
  }
}


const notificationReducer = (state = { text: '', timer: null }, action) => {

  switch (action.type) {
    case 'SET_NOTIFICATION':
      clearTimer(state.timer)
      return {
        text: action.data.text,
        timer: action.data.timer
      }
    case 'CLEAR_NOTIFICATION':
      clearTimer(state.timer)
      return { text: '', timer: null }
    default:
      return state
  }

}

export default notificationReducer