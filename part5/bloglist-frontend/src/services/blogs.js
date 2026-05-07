import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (newObject, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, updatedObject, token) => {
  //const config = {
  //  headers: { Authorization: `Bearer ${token}` }
  //}
  const response = await axios.put(`${baseUrl}/${id}`, updatedObject/*, config*/)
  return response.data
}

export default { getAll, create, update }