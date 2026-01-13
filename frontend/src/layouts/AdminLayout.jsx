import { useState } from "react"
import { Outlet } from "react-router-dom" 
import Sidebar from "../components/Sidebar"

function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      <Sidebar onCollapseChange={setCollapsed} />

      <main
        className={`
          min-h-screen bg-gray-100 transition-all duration-300
          ${collapsed ? "ml-14" : "ml-64"}
        `}
      >
        <Outlet /> 
      </main>
    </>
  )
}

export default AdminLayout
