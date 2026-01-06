import axios from "./Axios/axios"

export const getTotalRevenue = () => {
  return axios.get("api/revenue/total")
}

export const getRevenueByDay = (from, to) => {
  return axios.get("api/revenue/day", { params: { from, to } })
}

export const getRevenueByMonth = (year) => {
  return axios.get("api/revenue/month", { params: { year } })
}

export const getTodayRevenue = () => {
  return axios.get("api/revenue/today")
}

export const getRevenueByProductType = () => {
  return axios.get("api/revenue/type")
}

export const getTopSellingProducts = (limit) => {
  return axios.get("api/revenue/top", { params: { limit } })
}