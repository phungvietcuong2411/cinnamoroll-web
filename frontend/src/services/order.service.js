import axios from "./Axios/axios"

export const getAllOrders = () => {
  return axios.get("api/orders");
};

export const getMyOrders = () => {
  return axios.get("api/orders/my");
};

export const updateOrderStatus = (id, status) => {
  return axios.put(`api/orders/${id}/status`, { status });
};

export const createOrder = (data) => {
  return axios.post("api/orders", data);
};

export const createOrderVNpay = (data) => {
  return axios.post("api/orders/vnpay", data);
};

export const cancelOrder = (orderId) => {
  return axios.put(`api/orders/${orderId}/cancel`)
}

export const deleteOrder = (orderId) => {
  return axios.delete(`api/orders/${orderId}`)
}