import { Link, useNavigate, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingCart,
  BarChart3,
  ChevronDown,
  Home,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Users,
  MessageCircle
} from "lucide-react"
import { useState } from "react"
import { ADMIN_ROUTES } from "../../routes/admin.routes"

function Sidebar({ onCollapseChange }) {
  const [collapsed, setCollapsed] = useState(false)
  const [openProduct, setOpenProduct] = useState(true)

  const navigate = useNavigate()
  const location = useLocation()

  const toggleCollapse = () => {
    const next = !collapsed
    setCollapsed(next)
    onCollapseChange?.(next)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  const isActive = (path) => location.pathname.startsWith(path)

  const linkClass = (active) =>
    `flex items-center gap-3 px-3 py-2 rounded transition
     ${active ? "bg-gray-700" : "hover:bg-gray-700"}`

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen bg-gray-900 text-white
        transition-all duration-300
        ${collapsed ? "w-14" : "w-64"}
        flex flex-col font-futura-regular
      `}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">
        {!collapsed && <span className="text-lg font-bold">ADMIN</span>}
        <button
          onClick={toggleCollapse}
          className="p-2 rounded hover:bg-gray-700"
        >
          {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-2 text-sm space-y-1 overflow-y-auto">

        {/* Users */}
        <Link
          to={ADMIN_ROUTES.USERS}
          className={linkClass(isActive(ADMIN_ROUTES.USERS))}
        >
          <Users size={18} />
          {!collapsed && <span>Quản lý khách hàng</span>}
        </Link>

        {/* Product */}
        <div>
          <button
            onClick={() => setOpenProduct(!openProduct)}
            className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-gray-700"
          >
            <div className="flex items-center gap-3">
              <Package size={18} />
              {!collapsed && <span>Danh mục sản phẩm</span>}
            </div>
            {!collapsed && (
              <ChevronDown
                size={16}
                className={`${openProduct ? "rotate-180" : ""} transition`}
              />
            )}
          </button>

          {!collapsed && openProduct && (
            <div className="ml-10 mt-1 space-y-1">
              <Link
                to={ADMIN_ROUTES.PRODUCTS}
                className={linkClass(isActive(ADMIN_ROUTES.PRODUCTS))}
              >
                <Package size={16} />
                <span>Quản lý sản phẩm</span>
              </Link>

              <Link
                to={ADMIN_ROUTES.TYPES}
                className={linkClass(isActive(ADMIN_ROUTES.TYPES))}
              >
                <Layers size={16} />
                <span>Loại sản phẩm</span>
              </Link>
            </div>
          )}
        </div>

        {/* Orders */}
        <Link
          to={ADMIN_ROUTES.ORDERS}
          className={linkClass(isActive(ADMIN_ROUTES.ORDERS))}
        >
          <ShoppingCart size={18} />
          {!collapsed && <span>Đơn hàng</span>}
        </Link>

        {/* Revenue */}
        <Link
          to={ADMIN_ROUTES.REVENUE}
          className={linkClass(isActive(ADMIN_ROUTES.REVENUE))}
        >
          <BarChart3 size={18} />
          {!collapsed && <span>Doanh thu</span>}
        </Link>
        {/* Chat */}
        <Link
          to={ADMIN_ROUTES.CHAT}
          className={linkClass(isActive(ADMIN_ROUTES.CHAT))}
        >
          <MessageCircle size={18} />
          {!collapsed && (
            <div className="flex items-center justify-between w-full">
              <span>Tin nhắn</span>

              {/* Badge unread (mock) */}
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                3
              </span>
            </div>
          )}
        </Link>

      </nav>


      {/* Footer */}
      <div className="p-2 border-t border-gray-700 space-y-1">
        <Link
          to="/home"
          className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-700"
        >
          <Home size={18} />
          {!collapsed && <span>Về trang chủ</span>}
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-red-600"
        >
          <LogOut size={18} />
          {!collapsed && <span>Đăng xuất</span>}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
