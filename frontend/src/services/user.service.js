import axios from "./Axios/axios"

export const getAllUsers = () => {
  return axios.get("api/users")
}

export const getUserById = (id) => {
  return axios.get(`api/users/${id}`)
}

export const createUser = (data) => {
  return axios.post("api/users", data)
}

export const updateUser = (id, data) => {
  return axios.put(`api/users/${id}`, data)
}

export const deleteUser = (id) => {
  return axios.delete(`api/users/${id}`)
}

export const changePassword = (data) => {
  return axios.put("api/users/change-password", data)
}