import { useEffect, useState, useRef } from "react"
import { useParams, Link } from "react-router-dom"
import { Heart, LoaderCircle } from "lucide-react"
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import CartNotification from "../../../components/CartNotification"
import LoadingOverlay from "../../../components/LoadingOverlay"
import {
  getProductById,
  getRandomProducts
} from "../../../services/product.service"
import {
  getMyFollows,
  followProduct,
  unfollowProduct
} from "../../../services/follow.service"
import { addToCart } from "../../../services/cart.service"

function Detail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [qty, setQty] = useState(1)
  const [liked, setLiked] = useState(false)
  const [mainImage, setMainImage] = useState("")
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success"
  })

  // Ref cho danh sách ảnh phụ để xử lý drag
  const imageListRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startY, setStartY] = useState(0)
  const [scrollTop, setScrollTop] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await getProductById(id)
        const data = res.data
        setProduct(data)
        setMainImage(data.imgMain)

        const randomRes = await getRandomProducts(6)
        setRelatedProducts(randomRes.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  useEffect(() => {
    const checkFollowed = async () => {
      try {
        const res = await getMyFollows()
        const followedIds = res.data.map(item => item.productId)
        setLiked(followedIds.includes(Number(id)))
      } catch (err) {
        console.error(err)
      }
    }

    checkFollowed()
  }, [id])

  const handleAddToCart = async () => {
    if (adding) return

    try {
      setAdding(true)
      await addToCart(product.id, qty)

      setToast({
        show: true,
        message: "Thêm vào giỏ hàng thành công!",
        type: "success"
      })
    } catch (err) {
      const message =
        err.response?.status === 401
          ? "Đăng nhập để thêm vào giỏ hàng"
          : err.response?.data?.message || "Thêm vào giỏ hàng thất bại"

      setToast({
        show: true,
        message,
        type: "error"
      })
    } finally {
      setAdding(false)
    }
  }

  const increase = () => setQty(prev => (prev < product.quantity ? prev + 1 : prev))
  const decrease = () => setQty(prev => (prev > 1 ? prev - 1 : 1))

  const toggleFollow = async () => {
    if (followLoading) return

    try {
      setFollowLoading(true)
      if (liked) {
        await unfollowProduct(product.id)
        setLiked(false)
      } else {
        await followProduct(product.id)
        setLiked(true)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setFollowLoading(false)
    }
  }

  // Xử lý drag cho danh sách ảnh phụ trên desktop
  const handleMouseDown = (e) => {
    if (window.innerWidth < 768) return // Chỉ desktop
    setIsDragging(true)
    setStartY(e.pageY - imageListRef.current.offsetTop)
    setScrollTop(imageListRef.current.scrollTop)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e) => {
    if (!isDragging || window.innerWidth < 768) return
    e.preventDefault()
    const y = e.pageY - imageListRef.current.offsetTop
    const walk = (y - startY) * 2 // Tốc độ kéo
    imageListRef.current.scrollTop = scrollTop - walk
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="h-16" />
        {loading && <LoadingOverlay />}
        <div className="h-screen" />
        <Footer />
      </>
    )
  }

  const allImages = [product.imgMain, ...product.images.map(i => i.url)]

  return (
    <>
      <Header />
      <div className="h-16" />

      <CartNotification
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
      />

      <div className="hidden md:flex h-20 items-center font-futura-regular text-sm px-36 mb-8">
        <Link to="/home" className="cursor-pointer">Trang chủ</Link>
        <span className="mx-2">/</span>
        <Link to="/product" className="cursor-pointer">Cửa hàng</Link>
        <span className="mx-2">/</span>
        <span>{product.name}</span>
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16 px-4 md:px-36">
        <div className="w-full md:w-160">
          {/* Ảnh chính */}
          <div className="w-full aspect-square mb-6">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover rounded-xl shadow-md"
            />
          </div>

          {/* Ảnh phụ - Desktop: cuộn dọc | Mobile: cuộn ngang */}
          <div className="
            flex md:flex gap-3 
            overflow-x-auto md:overflow-y-auto 
            scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100
            pb-2 md:pb-0
          ">
            {allImages.map((img, i) => (
              <div
                key={i}
                onClick={() => setMainImage(img)}
                className={`
                  shrink-0 cursor-pointer transition-all duration-300
                `}
              >
                <img
                  src={img}
                  alt={`Ảnh phụ ${i + 1}`}
                  className="
                    w-27 object-cover
                    h-24 md:h-auto
                  "
                />
              </div>
            ))}
          </div>
        </div>

        <div className="w-full md:w-160">
          <h1 className="font-frankfurter text-xl md:text-2xl mb-2">
            {product.name}
          </h1>

          <div className="font-futura-regular text-sm mb-1">
            Item#: {product.id}
          </div>

          <div className="font-frankfurter text-lg mb-2">
            {Number(product.price).toLocaleString()} VND
          </div>

          <div className="font-futura-regular text-sm mb-4">
            Số lượng còn lại: <span className="font-bold">{product.quantity}</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex border items-center">
              <button onClick={decrease} className="px-4 py-3 border-r cursor-pointer">
                -
              </button>
              <input
                type="number"
                value={qty}
                onChange={e => {
                  const value = Number(e.target.value)
                  if (!isNaN(value)) {
                    setQty(Math.max(1, Math.min(value, product.quantity)))
                  }
                }}
                className="w-20 text-center outline-none font-frankfurter py-2"
              />
              <button onClick={increase} className="px-4 py-3 border-l cursor-pointer">
                +
              </button>
            </div>

            <button
              onClick={toggleFollow}
              className="border p-3 cursor-pointer flex items-center justify-center"
              disabled={followLoading}
            >
              {followLoading ? (
                <LoaderCircle className="w-5 h-5 animate-spin text-gray-400" />
              ) : (
                <Heart className={liked ? "fill-red-500 text-red-500" : "text-gray-400"} />
              )}
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="w-full border py-3 font-futura-regular transition flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-100"
            >
              {adding ? (
                <>
                  <LoaderCircle className="w-5 h-5 animate-spin" />
                  <span>Đang thêm...</span>
                </>
              ) : (
                "Thêm vào giỏ hàng"
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="my-16 px-4 md:px-36">
        <h2 className="font-futura-regular text-3xl md:text-4xl text-center mb-8">
          BẠN CÓ THỂ THÍCH
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-6">
          {relatedProducts.map(p => (
            <Link key={p.id} to={`/product/detail/${p.id}`} className="cursor-pointer">
              <div className="bg-[#f7f7f7] p-3 md:h-75 flex flex-col justify-between">
                <img
                  src={p.imgMain}
                  alt={p.name}
                  className="rounded-lg mb-3 aspect-square object-cover"
                />
                <p className="font-futura-regular text-sm mb-2">{p.name}</p>
                <p className="font-frankfurter border px-3 py-2 text-sm text-center">
                  {Number(p.price).toLocaleString()} VND
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </>
  )
}

export default Detail