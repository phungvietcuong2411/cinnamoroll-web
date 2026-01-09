import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import { getAllProducts } from "../../../services/product.service"
import { getAllTypes } from "../../../services/type.service"

function Product() {
  // State cho filter
  const [featured, setFeatured] = useState([]) // Hiện chưa dùng để sort, giữ lại cho tương lai
  const [type, setType] = useState([])
  const [price, setPrice] = useState([])
  const [typeList, setTypeList] = useState([])

  // State chung
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Mobile filter
  const [openMobileFilter, setOpenMobileFilter] = useState(false)

  // Accordion filter
  const [openFeatured, setOpenFeatured] = useState(true)
  const [openType, setOpenType] = useState(true)
  const [openPrice, setOpenPrice] = useState(true)

  const LIMIT = 16

  const featuredList = ["Best Seller", "New Arrival", "Trending", "On Sale"]

  const priceList = [
    "Dưới 100.000 VND",
    "100.000 VND - 200.000 VND",
    "200.000 VND - 300.000 VND",
    "Trên 300.000 VND",
  ]

  // Chuyển các lựa chọn giá thành min/max
  const mapPriceToRange = (priceArr) => {
    let minPrice = null
    let maxPrice = null

    priceArr.forEach((p) => {
      if (p === "Dưới 100.000 VND") {
        maxPrice = maxPrice === null ? 100000 : Math.min(maxPrice, 100000)
      } else if (p === "100.000 VND - 200.000 VND") {
        minPrice = minPrice === null ? 100000 : Math.min(minPrice, 100000)
        maxPrice = maxPrice === null ? 200000 : Math.max(maxPrice, 200000)
      } else if (p === "200.000 VND - 300.000 VND") {
        minPrice = minPrice === null ? 200000 : Math.min(minPrice, 200000)
        maxPrice = maxPrice === null ? 300000 : Math.max(maxPrice, 300000)
      } else if (p === "Trên 300.000 VND") {
        minPrice = minPrice === null ? 300000 : Math.max(minPrice, 300000)
      }
    })

    return { minPrice, maxPrice }
  }

  // Fetch danh sách loại sản phẩm (chỉ gọi 1 lần)
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await getAllTypes()
        setTypeList(res.data || [])
      } catch (err) {
        console.error("Lỗi tải loại sản phẩm:", err)
      }
    }
    fetchTypes()
  }, [])

  // Fetch sản phẩm khi filter hoặc page thay đổi
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const { minPrice, maxPrice } = mapPriceToRange(price)

        const params = {}
        if (type.length > 0) params.types = type.join(",")
        if (minPrice !== null) params.minPrice = minPrice
        if (maxPrice !== null) params.maxPrice = maxPrice

        const res = await getAllProducts({
          ...params,
          page,
          limit: LIMIT,
        })

        setProducts(res.data.products || [])
        setTotalPages(res.data.pagination?.totalPages || 1)
      } catch (err) {
        console.error("Lỗi tải sản phẩm:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [type, price, featured, page]) // featured giữ lại để sau này mở rộng sort

  // Toggle checkbox filter
  const toggleItem = (value, setter) => {
    setter((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    )
    setPage(1) // Reset về trang 1 khi filter thay đổi
  }

  // Xóa tất cả filter
  const clearFilters = () => {
    setFeatured([])
    setType([])
    setPrice([])
    setPage(1)
  }

  return (
    <>
      <Header />
      <div className="h-16" />

      <div className="px-4 md:px-10 py-6">
        {/* Nút mở filter trên mobile */}
        <button
          onClick={() => setOpenMobileFilter(true)}
          className="md:hidden flex items-center gap-2 mb-6 text-sm font-futura-regular"
        >
          Bộ lọc
          <ChevronRight size={18} />
        </button>

        <div className="flex gap-8">
          {/* Sidebar Filter */}
          <aside
            className={`
              bg-white p-6 md:p-4 md:w-64 md:rounded-xl md:sticky md:top-24
              font-futura-regular text-sm shadow-sm
              ${openMobileFilter
                ? "fixed inset-0 top-16 z-50 overflow-y-auto bg-white"
                : "hidden md:block"
              }
            `}
          >
            {/* Header mobile */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setOpenMobileFilter(false)}
                className="md:hidden"
              >
                <ChevronLeft size={24} />
              </button>
              <h1 className="text-xl md:text-2xl font-futura-regular mx-auto md:mx-0">
                BỘ LỌC
              </h1>
            </div>

            {/* Sắp xếp theo (featured) */}
            <div className="border-b pb-4 mb-4">
              <button
                onClick={() => setOpenFeatured(!openFeatured)}
                className="flex justify-between w-full font-medium"
              >
                Sắp xếp theo
                {openFeatured ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
              </button>
              {openFeatured && (
                <div className="mt-3 space-y-2">
                  {featuredList.map((item) => (
                    <label key={item} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={featured.includes(item)}
                        onChange={() => toggleItem(item, setFeatured)}
                        className="accent-blue-500"
                      />
                      {item}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Loại sản phẩm */}
            <div className="border-b pb-4 mb-4">
              <button
                onClick={() => setOpenType(!openType)}
                className="flex justify-between w-full font-medium"
              >
                Loại sản phẩm
                {openType ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
              </button>
              {openType && (
                <div className="mt-3 space-y-2">
                  {typeList.map((item) => (
                    <label key={item.id} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={type.includes(item.id)}
                        onChange={() => toggleItem(item.id, setType)}
                        className="accent-blue-500"
                      />
                      {item.nameType}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Giá */}
            <div className="border-b pb-4 mb-6">
              <button
                onClick={() => setOpenPrice(!openPrice)}
                className="flex justify-between w-full font-medium"
              >
                Giá
                {openPrice ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
              </button>
              {openPrice && (
                <div className="mt-3 space-y-2">
                  {priceList.map((item) => (
                    <label key={item} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={price.includes(item)}
                        onChange={() => toggleItem(item, setPrice)}
                        className="accent-blue-500"
                      />
                      {item}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Nút xóa filter */}
            <button
              onClick={clearFilters}
              className="text-blue-500 hover:underline text-sm"
            >
              Xóa tất cả bộ lọc
            </button>
          </aside>

          {/* Danh sách sản phẩm */}
          <section className="flex-1">
            {loading ? (
              <div className="text-center py-20 text-gray-500">Đang tải sản phẩm...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                Không tìm thấy sản phẩm nào
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {products.map((product) => {
                  const allImages = [
                    product.imgMain,
                    ...(product.images?.map((i) => i.url) || []),
                  ]

                  return (
                    <Link
                      key={product.id}
                      to={`/product/detail/${product.id}`}
                      className="group relative bg-[#f7f7f7] overflow-hidden flex flex-col"
                    >
                      <div className="aspect-square relative flex items-center justify-center">
                        <img
                          src={product.imgMain}
                          alt={product.name}
                          className="w-[95%] h-[95%] object-cover"
                        />

                        {/* Thumbnail nhỏ khi hover (desktop) */}
                        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/50 to-transparent opacity-0 transition-opacity p-3">
                          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                            {allImages.slice(1).map((img, idx) => (
                              <img
                                key={idx}
                                src={img}
                                alt=""
                                className="w-12 h-12 object-cover rounded border-2 border-white shrink-0"
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="p-3 flex flex-col flex-1 justify-between">
                        <p className="font-futura-regular text-sm line-clamp-2 my-2">
                          {product.name}
                        </p>
                        <p className="font-frankfurter text-sm text-center bg-white border py-2">
                          {Number(product.price).toLocaleString("vi-VN")} VND
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </section>
        </div>

        {totalPages > 1 && (
          <div className="mt-12 mb-8 font-frankfurter">
            <nav className="flex items-center justify-center gap-6">
              {/* Các nút trang */}
              <div className="flex items-center gap-2">
                {/* Prev */}
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  aria-label="Trang trước"
                >
                  <ChevronLeft size={18} />
                </button>

                {/* Số trang thông minh */}
                {(() => {
                  const pages = []
                  const maxVisible = 5
                  let start = Math.max(1, page - Math.floor(maxVisible / 2))
                  let end = Math.min(totalPages, start + maxVisible - 1)

                  if (end - start + 1 < maxVisible) {
                    start = Math.max(1, end - maxVisible + 1)
                  }

                  // Trang 1 + ...
                  if (start > 1) {
                    pages.push(
                      <button
                        key={1}
                        onClick={() => setPage(1)}
                        className="w-10 h-10 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 transition-all"
                      >
                        1
                      </button>
                    )
                    if (start > 2) {
                      pages.push(
                        <span key="start-dots" className="px-2 text-gray-400">
                          ...
                        </span>
                      )
                    }
                  }

                  // Các trang giữa
                  for (let i = start; i <= end; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => setPage(i)}
                        className={`w-10 h-10 text-sm font-medium transition-all ${
                          page === i
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        {i}
                      </button>
                    )
                  }

                  // ... + Trang cuối
                  if (end < totalPages) {
                    if (end < totalPages - 1) {
                      pages.push(
                        <span key="end-dots" className="px-2 text-gray-400">
                          ...
                        </span>
                      )
                    }
                    pages.push(
                      <button
                        key={totalPages}
                        onClick={() => setPage(totalPages)}
                        className="w-10 h-10 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 transition-all"
                      >
                        {totalPages}
                      </button>
                    )
                  }

                  return pages
                })()}

                {/* Next */}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  aria-label="Trang sau"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={page}
                    onChange={(e) => {
                      const val = e.target.value
                      if (val === "") return
                      const num = parseInt(val, 10)
                      if (!isNaN(num) && num >= 1 && num <= totalPages) {
                        setPage(num)
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const val = parseInt(e.target.value, 10)
                        if (val >= 1 && val <= totalPages) {
                          setPage(val)
                        }
                      }
                    }}
                    className="w-16 h-10 px-3 py-2.5 text-center border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:hidden [&::-webkit-inner-spin-button]:hidden"
                  />
                </div>

                <span className="hidden sm:inline">
                  Trang <strong>{page}</strong> / <strong>{totalPages}</strong>
                </span>
              </div>
            </nav>
          </div>
        )}
      </div>

      <Footer />
    </>
  )
}

export default Product