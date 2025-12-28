import axios from "./Axios/axios"

export const login = async (data) => {
  const res = await axios.post("api/auth/login", data)

  if (res.data.token) {
    localStorage.setItem("token", res.data.token)
  }

  return res.data
}
