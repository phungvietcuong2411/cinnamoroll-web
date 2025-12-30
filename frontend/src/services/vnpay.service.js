import axios from "./Axios/axios"

export const createPayment = (data) => {
  return axios.post("api/vnpay/create-qr", data)
}

export const vnpayReturn = (query) => {
  return axios.get("api/vnpay/return", { params: query })
}