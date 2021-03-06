import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const authHeader = () => { return { headers: { Authorization: token } } }

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async blog => {
  const response = await axios.post(baseUrl, blog, authHeader())
  return response.data
}

const update = async blog => {
  const response = await axios.put(`${baseUrl}/${blog.id}`, blog)
  return response.data
}

const remove = async blog => {
  const response = await axios.delete(`${baseUrl}/${blog.id}`, authHeader())
  return response.data
}

export default { getAll, create, update, remove, setToken }