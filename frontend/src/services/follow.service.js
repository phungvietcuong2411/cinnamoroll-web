import axios from "./Axios/axios"

export const getMyFollows = () => {
  return axios.get("api/follow")
}

export const followProduct = (id) => {
  return axios.post(`api/follow/${id}`)
}

export const unfollowProduct = (id) => {
  return axios.delete(`api/follow/${id}`)
}

