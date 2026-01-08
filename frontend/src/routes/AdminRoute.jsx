import { Navigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token")

  if (!token) {
    return <Navigate to="/login" replace />
  }

  const user = jwtDecode(token)

  if (user.role !== "admin") {
    return <Navigate to="/home" replace />
  }

  return children
}

export default AdminRoute
