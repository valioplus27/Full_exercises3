import axios from 'axios'

const baseUrl = '/api/persons'

const getAll = () => {
  return axios
    .get(baseUrl)
    .then(response => {
      console.log('Data received:', response.data)
      return response
    })
    .catch(error => {
      console.error('Network error:', error.message)
      throw error
    })
}

const create = newObject => {
  return axios
    .post(baseUrl, newObject)
    .then(response => {
      console.log('Create successful:', response.data)
      return response
    })
    .catch(error => {
      console.error('Create error:', error.response?.data || error.message)
      throw error
    })
}

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject)
}
const remove = id => {
    return axios.delete(`${baseUrl}/${id}`)
  }

export default { 
  getAll, 
  create, 
  update,
  remove
}