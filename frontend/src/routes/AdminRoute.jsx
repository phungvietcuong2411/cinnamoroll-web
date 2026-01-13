import { Navigate, Outlet } from "react-router-dom"
import { jwtDecode } from "jwt-decode"

const AdminRoute = () => {
  const token = localStorage.getItem("token")

  if (!token) {
    return <Navigate to="/login" replace />
  }

  const user = jwtDecode(token)

  if (user.role !== "admin") {
    return <Navigate to="/home" replace />
  }

  return <Outlet />
}

export default AdminRoute
