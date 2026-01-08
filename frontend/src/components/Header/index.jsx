import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Menu,
  X,
  Heart,
  ShoppingCart,
  LogIn,
  ChevronDown,
  ChevronUp,
  Settings,
  Truck,
  Search as SearchIcon
} from "lucide-react"
import { jwtDecode } from "jwt-decode"
import { getAllProducts } from "../../services/product.service" // Đường dẫn service của bạn

function Header() {
  const [open, setOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [mobileAccountOpen, setMobileAccountOpen] = useState(false)
  const [user, setUser] = useState(null)

  // Tìm kiếm
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [showSearchOverlay, setShowSearchOverlay] = useState(false) // Desktop
  const [showMobileSearch, setShowMobileSearch] = useState(false)    // Mobile modal
  const [loadingSearch, setLoadingSearch] = useState(false)

  const navigate = useNavigate()
  const searchTimeoutRef = useRef(null)

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

  // Debounce tìm kiếm (dùng chung cho cả desktop và mobile)
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([])
      return
    }

    setLoadingSearch(true)

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await getAllProducts({
          keyword: searchQuery,
          limit: 7
        })
        setSearchResults(res.data.products || [])
      } catch (err) {
        console.error("Lỗi tìm kiếm:", err)
        setSearchResults([])
      } finally {
        setLoadingSearch(false)
      }
    }, 400)

    return () => clearTimeout(searchTimeoutRef.current)
  }, [searchQuery])

  const closeAllSearch = () => {
    setShowSearchOverlay(false)
    setShowMobileSearch(false)
    setSearchQuery("")
    setSearchResults([])
  }

  return (
    <>
      {/* HEADER */}
      <header className="h-16 font-futura-regular border-b border-blue-200 px-4 md:px-20 text-blue-500 flex items-center fixed inset-0 z-1000 bg-white/80">
        {/* LEFT MENU - DESKTOP */}
        <div className="hidden md:flex gap-8">
          <Link to="/home" className="hover:text-blue-700">Trang chủ</Link>
          <Link to="/product" className="hover:text-blue-700">Cửa hàng</Link>

          {user?.role === "admin" && (
            <Link to="/manage/revenue" className="hover:text-blue-700 font-semibold">
              Quản lý
            </Link>
          )}
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
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setShowSearchOverlay(true)
            }}
            onFocus={() => searchQuery && setShowSearchOverlay(true)}
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
                <div className="mb-3">
                  <p className="text-sm text-blue-400">Hello,</p>
                  <p className="font-futura-regular">
                    {user ? user.name : 'Guest'}
                  </p>
                </div>
                <hr className="border-blue-200 mb-3" />
                <div className="flex flex-col gap-3 text-sm">
                  <Link to="/follows" className="flex items-center gap-2 hover:text-blue-700">
                    <Heart size={16} /> Yêu thích
                  </Link>
                  <Link to="/cart" className="flex items-center gap-2 hover:text-blue-700">
                    <ShoppingCart size={16} /> Giỏ hàng
                  </Link>
                  <Link to="/order" className="flex items-center gap-2 hover:text-blue-700">
                    <Truck size={16} /> Theo dõi đơn hàng
                  </Link>
                  <Link to="/setting" className="flex items-center gap-2 hover:text-blue-700">
                    <Settings size={16} /> Thiết lập
                  </Link>
                  {user ? (
                    <button onClick={handleLogout} className="flex items-center gap-2 hover:text-blue-700 text-left">
                      <LogIn size={16} /> Đăng xuất
                    </button>
                  ) : (
                    <Link to="/login" className="flex items-center gap-2 hover:text-blue-700">
                      <LogIn size={16} /> Đăng nhập
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* SEARCH BUTTON - MOBILE */}
          <button
            className="md:hidden"
            onClick={() => setShowMobileSearch(true)}
          >
            <SearchIcon size={24} />
          </button>

          {/* HAMBURGER */}
          <button
            className="md:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu size={28} />
          </button>
        </div>
      </header>

      {/* ================== SEARCH OVERLAY (DESKTOP) ================== */}
      {showSearchOverlay && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={closeAllSearch} />
          <div className="fixed inset-x-0 top-16 bg-white z-50 shadow-xl max-h-[80vh] overflow-y-auto font-futura-regular">
            <div className="px-4 md:px-20 py-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">
                  Kết quả cho: <span className="text-blue-600">"{searchQuery}"</span>
                </h3>
                <button onClick={closeAllSearch}>
                  <X size={26} className="text-gray-500" />
                </button>
              </div>

              {loadingSearch ? (
                <p className="text-center py-8 text-gray-500">Đang tìm kiếm...</p>
              ) : searchResults.length === 0 ? (
                <p className="text-center py-8 text-gray-500">Không tìm thấy sản phẩm nào</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
                  {searchResults.map(product => (
                    <Link
                      key={product.id}
                      to={`/product/detail/${product.id}`}
                      onClick={closeAllSearch}
                      className="text-center hover:scale-105 transition"
                    >
                      <img
                        src={product.imgMain}
                        alt={product.name}
                        className="w-full aspect-square object-cover rounded-lg mb-3 shadow"
                      />
                      <p className="text-sm line-clamp-2 mb-1">{product.name}</p>
                      <p className="font-bold text-blue-600">
                        {Number(product.price).toLocaleString()} VND
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ================== MOBILE SEARCH MODAL ================== */}
      {showMobileSearch && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50" onClick={closeAllSearch} />
          <div className="fixed inset-x-0 top-0 bottom-0 bg-white z-1036 flex flex-col font-futura-regular">
            <div className="h-16 border-b flex items-center px-4 justify-between">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="flex-1 px-4 py-2 text-lg outline-none"
              />
              <button onClick={closeAllSearch}>
                <X size={28} className="text-blue-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6">
              {loadingSearch ? (
                <p className="text-center py-12 text-gray-500">Đang tìm kiếm...</p>
              ) : searchResults.length === 0 ? (
                <p className="text-center py-12 text-gray-500">Không tìm thấy sản phẩm nào</p>
              ) : (
                <div className="grid grid-cols-2 gap-6">
                  {searchResults.map(product => (
                    <Link
                      key={product.id}
                      to={`/product/detail/${product.id}`}
                      onClick={closeAllSearch}
                      className="text-center"
                    >
                      <img
                        src={product.imgMain}
                        alt={product.name}
                        className="w-full aspect-square object-cover rounded-lg mb-3 shadow"
                      />
                      <p className="text-sm line-clamp-2 mb-1">{product.name}</p>
                      <p className="font-bold text-blue-600">
                        {Number(product.price).toLocaleString()} VND
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* MOBILE MENU OVERLAY */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setOpen(false)} />
      )}

      {/* MOBILE MENU */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white z-1001 transform transition-transform duration-300 font-futura-regular
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-end p-4">
          <button onClick={() => setOpen(false)}>
            <X size={26} className="text-blue-500" />
          </button>
        </div>

        {/* MENU ITEMS (giữ nguyên của bạn) */}
        <nav className="flex flex-col gap-6 px-6 text-lg text-blue-500">
          <Link to="/home" onClick={() => setOpen(false)} className="hover:text-blue-700">Trang chủ</Link>
          <Link to="/product" onClick={() => setOpen(false)} className="hover:text-blue-700">Sản phẩm</Link>

          <hr className="border-blue-200 my-2" />

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

                <Link to="/follows" onClick={() => setOpen(false)} className="flex items-center gap-2 hover:text-blue-700">
                  <Heart size={18} /> Yêu thích
                </Link>
                <Link to="/cart" onClick={() => setOpen(false)} className="flex items-center gap-2 hover:text-blue-700">
                  <ShoppingCart size={18} /> Giỏ hàng
                </Link>
                <Link to="/order" onClick={() => setOpen(false)} className="flex items-center gap-2 hover:text-blue-700">
                  <Truck size={16} /> Theo dõi đơn hàng
                </Link>
                <Link to="/setting" onClick={() => setOpen(false)} className="flex items-center gap-2 hover:text-blue-700">
                  <Settings size={16} /> Thiết lập
                </Link>
                {user ? (
                  <button onClick={handleLogout} className="flex items-center gap-2 hover:text-blue-700 text-left">
                    <LogIn size={18} /> Đăng xuất
                  </button>
                ) : (
                  <Link to="/login" onClick={() => setOpen(false)} className="flex items-center gap-2 hover:text-blue-700">
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