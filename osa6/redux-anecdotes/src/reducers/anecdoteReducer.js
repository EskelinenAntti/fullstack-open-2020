import anecdoteService from '../services/anecdote'

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INITIALIZE',
      data: { anecdotes }
    })
  }
}

export const voteAnecdote = id => {
  return async dispatch => {
    const oldAnecdote = await anecdoteService.getSingle(id)
    const updatedAnecdote = { ...oldAnecdote, votes: oldAnecdote.votes + 1 }
    await anecdoteService.update(updatedAnecdote)

    dispatch({
      type: 'UPDATE',
      data: { anecdote: updatedAnecdote }
    })
  }
}

export const addAnecdote = content => {
  return async dispatch => {
    const anecdote = await anecdoteService.create({ content, votes: 0 })
    dispatch({
      type: 'ADD',
      data: { anecdote }
    })
  }
}

const reducer = (state = [], action) => {

  switch (action.type) {
    case 'UPDATE':

      const updatedAnecdote = action.data.anecdote

      return state
        .map(a => a.id !== updatedAnecdote.id ? a : updatedAnecdote)
        .sort((a1,a2) => a2.votes - a1.votes)
    case 'ADD':
      return state.concat(action.data.anecdote)
    case 'INITIALIZE':
      return state.concat(action.data.anecdotes)
    default:
      return state
  }
}

export default reducer