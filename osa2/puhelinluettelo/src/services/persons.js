import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
  return toActualObject(axios.get(baseUrl))
}

const create = newObject => {
  return toActualObject(axios.post(baseUrl, newObject))
}

const update = (id, newObject) => {
  return toActualObject(axios.put(`${baseUrl}/${id}`, newObject))
}

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`)
}

const toActualObject = (request) => {
    return request.then(response => response.data)
}

export default {getAll, create, update, remove}