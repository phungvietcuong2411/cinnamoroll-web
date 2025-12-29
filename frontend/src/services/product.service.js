import axios from "./Axios/axios"

export const getAllProducts = (params = {}) => {
  return axios.get("api/products", { params })
}

export const getProductById = (id) => {
  return axios.get(`api/products/${id}`)
}

export const createProduct = (data) => {
  return axios.post("api/products", data)
}

export const updateProduct = (id, data) => {
  return axios.put(`api/products/${id}`, data)
}

export const deleteProduct = (id) => {
  return axios.delete(`api/products/${id}`)
}

export const getImagesByProduct = (id) => {
  return axios.get(`api/products/${id}/images`)
}

export const getRandomProducts = (count) => {
  return axios.get(`api/products/random/${count}`)
}