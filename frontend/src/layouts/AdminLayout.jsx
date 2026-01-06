import { useState } from "react"
import Sidebar from "../components/Sidebar"

function AdminLayout({ children }) {
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
        {children}
      </main>
    </>
  )
}

export default AdminLayout
