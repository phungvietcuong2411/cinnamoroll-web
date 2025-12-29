import axios from "./Axios/axios"

export const getAllTypes = () => {
  return axios.get("api/types")
}

export const getTypeById = (id) => {
  return axios.get(`api/types/${id}`)
}

export const createType = (data) => {
  return axios.post("api/types", data)
}

export const updateType = (id, data) => {
  return axios.put(`api/types/${id}`, data)
}

export const deleteType = (id) => {
  return axios.delete(`api/types/${id}`)
}