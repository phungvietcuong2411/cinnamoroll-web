import axios from "./Axios/axios"

export const getCart = () => {
  return axios.get("api/cart")
}

export const addToCart = (id, quantity) => {
  return axios.post("api/cart", { idProduct: id, quantity })
}

export const updateCart = (id, quantity) => {
  return axios.put(`api/cart/${id}`, { quantity })
}

export const removeFromCart = (id) => {
  return axios.delete(`api/cart/${id}`)
}