import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getSingle = async id => {
  return getResponseBody(axios.get(`${baseUrl}/${id}`))
}

const getAll = async () => {
  return getResponseBody(axios.get(baseUrl))
}

const create = async anecdote => {
  return getResponseBody(axios.post(baseUrl, anecdote))
}

const update = async anecdote => {
  return getResponseBody(axios.put(`${baseUrl}/${anecdote.id}`, anecdote))
}

const getResponseBody = async operation => {
  const response = await operation
  return response.data
}

export default { getAll, getSingle, create, update }