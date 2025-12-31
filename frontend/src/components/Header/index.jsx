import { useState, useEffect } from "react"
import { Link , useNavigate } from "react-router-dom"
import {
  Menu,
  X,
  Heart,
  ShoppingCart,
  LogIn,
  ChevronDown,
  ChevronUp,
  Settings,
  Truck
} from "lucide-react"
import { jwtDecode } from "jwt-decode"


function Header() {
  const [open, setOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [mobileAccountOpen, setMobileAccountOpen] = useState(false)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()


  const handleLogout = () => {
    localStorage.removeItem("token")
    setUser(null)
    setAccountOpen(false)
    setMobileAccountOpen(false)
    navigate("/login")
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setUser(decoded)
      } catch (err) {
        console.error('Invalid token')
        localStorage.removeItem('token')
      }
    }
  }, [])

  useEffect(() => {
    console.log('USER STATE:', user)
  }, [user])

  return (
    <>
      {/* HEADER */}
      <header className="h-16 font-futura-regular border-b border-blue-200 px-4 md:px-20 text-blue-500 flex items-center fixed inset-0 z-1000 bg-white/80">
        {/* LEFT MENU - DESKTOP */}
        <div className="hidden md:flex gap-8">
          <Link to="/home" className="hover:text-blue-700">Trang chủ</Link>
          <Link to="/product" className="hover:text-blue-700">Cửa hàng</Link>
        </div>
        {/* LOGO CENTER */}
        <Link
          to="/home"
          className="font-frankfurter absolute left-1/2 -translate-x-1/2 text-3xl md:text-4xl text-blue-400 cursor-pointer"
        >
          CINNAMOROLL
        </Link>

        {/* RIGHT */}
        <div className="ml-auto flex items-center gap-4">
          {/* SEARCH - DESKTOP */}
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="hidden md:block px-3 py-1 rounded-full border border-blue-300
                       hover:border-blue-400
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                       outline-none transition"
          />
          {/* ACCOUNT - DESKTOP */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setAccountOpen(!accountOpen)}
              className="flex items-center gap-1 hover:text-blue-700"
            >

              Tài khoản
            </button>
            {accountOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white border border-blue-200 rounded-xl shadow-lg p-4 text-blue-500">
                {/* USER INFO */}
                <div className="mb-3">
                  <p className="text-sm text-blue-400">Hello,</p>
                  <p className="font-futura-regular">
                    {user ? user.name : 'Guest'}
                  </p>
                </div>
                <hr className="border-blue-200 mb-3" />
                {/* MENU */}
                <div className="flex flex-col gap-3 text-sm">
                  <Link
                    to="/follows"
                    className="flex items-center gap-2 hover:text-blue-700"
                  >
                    <Heart size={16} /> Yêu thích
                  </Link>

                  <Link
                    to="/cart"
                    className="flex items-center gap-2 hover:text-blue-700"
                  >
                    <ShoppingCart size={16} /> Giỏ hàng
                  </Link>
                  <Link
                    to="/order"
                    className="flex items-center gap-2 hover:text-blue-700"
                  >
                    <Truck size={16} /> Theo dõi đơn hàng
                  </Link>
                  <Link
                    to="/setting"
                    className="flex items-center gap-2 hover:text-blue-700"
                  >
                    <Settings size={16} /> Thiết lập
                  </Link>
                  {user ? (
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 hover:text-blue-700 text-left"
                    >
                      <LogIn size={16} /> Đăng xuất
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="flex items-center gap-2 hover:text-blue-700"
                    >
                      <LogIn size={16} /> Đăng nhập
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* HAMBURGER */}
          <button
            className="md:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu size={28} />
          </button>
        </div>
      </header>

      {/* MOBILE MENU OVERLAY */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setOpen(false)} />
      )}

      {/* MOBILE MENU */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white z-1001 transform transition-transform duration-300 font-futura-regular
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* CLOSE */}
        <div className="flex justify-end p-4">
          <button onClick={() => setOpen(false)}>
            <X size={26} className="text-blue-500" />
          </button>
        </div>

        {/* SEARCH - MOBILE (LÊN ĐẦU) */}
        <div className="px-4 mb-6">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-full px-4 py-2 rounded-full border border-blue-300
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                       outline-none"
          />
        </div>

        {/* MENU ITEMS */}
        <nav className="flex flex-col gap-6 px-6 text-lg text-blue-500">
          <Link to="/home" className="hover:text-blue-700">Trang chủ</Link>
          <Link to="/product" className="hover:text-blue-700">Sản phẩm</Link>

          <hr className="border-blue-200 my-2" />

          {/* MY ACCOUNT - MOBILE */}
          <div>
            <button
              onClick={() => setMobileAccountOpen(!mobileAccountOpen)}
              className="flex items-center justify-between w-full text-blue-500 text-lg"
            >
              <div className="flex items-center gap-2">
                Tài khoản
              </div>
              {mobileAccountOpen ? <ChevronUp /> : <ChevronDown />}
            </button>

            {mobileAccountOpen && (
              <div className="mt-4 ml-6 flex flex-col gap-4 text-blue-500">
                <div>
                  <p className="text-sm text-blue-400">Hello,</p>
                  <p className="font-futura-regular">
                    {user ? user.name : 'Guest'}
                  </p>
                </div>

                <Link
                  to="/follows"
                  className="flex items-center gap-2 hover:text-blue-700"
                >
                  <Heart size={18} /> Yêu thích
                </Link>

                <Link
                  to="/cart"
                  className="flex items-center gap-2 hover:text-blue-700"
                >
                  <ShoppingCart size={18} /> Giỏ hàng
                </Link>
                <Link
                  to="/order"
                  className="flex items-center gap-2 hover:text-blue-700"
                >
                  <Truck size={16} /> Theo dõi đơn hàng
                </Link>
                <Link
                  to="/setting"
                  className="flex items-center gap-2 hover:text-blue-700"
                >
                  <Settings size={16} /> Thiết lập
                </Link>
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 hover:text-blue-700 text-left"
                  >
                    <LogIn size={18} /> Đăng xuất
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-2 hover:text-blue-700"
                  >
                    <LogIn size={18} /> Đăng nhập
                  </Link>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>
    </>
  )
}

export default Header
