import axios from "./Axios/axios"

export const createOrderProducts = (data) => {
  return axios.post("api/orders/products", data);
};

export const createOrderProductsVNPay = (data) => {
  return axios.post("api/orders/products/vnpay", data);
};

export const getOrderProductsByOrder = (orderId) => {
  return axios.get(`api/orders/products/${orderId}`)
}
