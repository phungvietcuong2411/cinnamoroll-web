import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import { getAllProducts } from "../../../services/product.service"
import { getAllTypes } from "../../../services/type.service"

function Product() {
  const [featured, setFeatured] = useState([])
  const [type, setType] = useState([])
  const [price, setPrice] = useState([])
  const [typeList, setTypeList] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [openMobileFilter, setOpenMobileFilter] = useState(false)

  const [openFeatured, setOpenFeatured] = useState(true)
  const [openType, setOpenType] = useState(true)
  const [openPrice, setOpenPrice] = useState(true)

  const featuredList = ["Best Seller", "New Arrival", "Trending", "On Sale"]
  const priceList = [
    "Dưới 100.000 VND",
    "100.000 VND - 200.000 VND",
    "200.000 VND - 300.000 VND",
    "Trên 300.000 VND"
  ]

  const mapPriceToRange = (priceArr) => {
    let minPrice = null
    let maxPrice = null

    priceArr.forEach(p => {
      if (p === "Dưới 100.000 VND") {
        maxPrice = maxPrice === null ? 100000 : Math.min(maxPrice, 100000)
      }
      if (p === "100.000 VND - 200.000 VND") {
        minPrice = minPrice === null ? 100000 : Math.min(minPrice, 100000)
        maxPrice = maxPrice === null ? 200000 : Math.max(maxPrice, 200000)
      }
      if (p === "200.000 VND - 300.000 VND") {
        minPrice = minPrice === null ? 200000 : Math.min(minPrice, 200000)
        maxPrice = maxPrice === null ? 300000 : Math.max(maxPrice, 300000)
      }
      if (p === "Trên 300.000 VND") {
        minPrice = minPrice === null ? 300000 : Math.max(minPrice, 300000)
      }
    })

    return { minPrice, maxPrice }
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const { minPrice, maxPrice } = mapPriceToRange(price)

        const params = {}
        if (type.length > 0) params.types = type.join(",")
        if (minPrice !== null) params.minPrice = minPrice
        if (maxPrice !== null) params.maxPrice = maxPrice

        const res = await getAllProducts(params)
        setProducts(res.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [type, price, featured])

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await getAllTypes()
        setTypeList(res.data || [])
      } catch (err) {
        console.error(err)
      }
    }

    fetchTypes()
  }, [])

  const toggleItem = (value, setter) => {
    setter(prev =>
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    )
  }

  const clearFilters = () => {
    setFeatured([])
    setType([])
    setPrice([])
  }

  return (
    <>
      <Header />
      <div className="h-16" />

      <div className="px-4 md:px-10 py-6">
        <button
          onClick={() => setOpenMobileFilter(true)}
          className="md:hidden flex items-center gap-2 mb-6 text-sm font-futura-regular"
        >
          Bộ lọc
          <ChevronRight size={18} />
        </button>

        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <aside
            className={`
              bg-white p-6 md:p-4 md:w-64 md:rounded-xl md:sticky md:top-24
              font-futura-regular text-sm
              ${openMobileFilter
                ? "fixed inset-0 top-16 z-50 overflow-y-auto bg-white"
                : "hidden md:block"
              }
            `}
          >
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

            {/* Sắp xếp theo */}
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
                  {featuredList.map(item => (
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
                  {typeList.map(item => (
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
                  {priceList.map(item => (
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

            <button
              onClick={clearFilters}
              className="text-blue-500 hover:underline text-sm"
            >
              Xóa tất cả bộ lọc
            </button>
          </aside>

          {/* Product Grid */}
          <section className="flex-1">
            {loading ? (
              <div className="text-center py-20 text-gray-500">
                Đang tải sản phẩm...
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                Không tìm thấy sản phẩm nào
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {products.map(product => {
                  const allImages = [product.imgMain, ...(product.images?.map(i => i.url) || [])]

                  return (
                    <Link
                      key={product.id}
                      to={`/product/detail/${product.id}`}
                      className="group relative bg-[#f7f7f7] overflow-hidden flex flex-col"
                    >
                      <div className="aspect-square relative">
                        <img
                          src={product.imgMain}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />

                        {/* Thumbnail scroll ngang khi hover (desktop) hoặc luôn hiện (mobile nếu nhiều ảnh) */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3">
                          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                            {allImages.slice(1).map((img, idx) => (
                              <img
                                key={idx}
                                src={img}
                                alt=""
                                className="w-12 h-12 object-cover rounded border-2 border-white flex-shrink-0"
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
      </div>

      <Footer />
    </>
  )
}

export default Product