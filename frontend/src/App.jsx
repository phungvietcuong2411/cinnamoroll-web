import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import GuestRoutes from "./routes/GuestRoutes"
import AdminRoutes from "./routes/AdminRoutes"
import Login from "./page/Guest/Login"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Navigate to="/home" />} />

        {GuestRoutes()}
        {AdminRoutes()}

        <Route path="/login" element={<Login />} />

        <Route path="*" element={<Navigate to="/home" />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
