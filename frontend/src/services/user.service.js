import axios from "./Axios/axios"

export const getAllUsers = () => {
  return axios.get("/users")
}

export const getUserById = (id) => {
  return axios.get(`/users/${id}`)
}

export const createUser = (data) => {
  return axios.post("/users", data)
}

export const updateUser = (id, data) => {
  return axios.put(`/users/${id}`, data)
}

export const deleteUser = (id) => {
  return axios.delete(`/users/${id}`)
}
