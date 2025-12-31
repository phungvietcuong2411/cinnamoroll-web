import { useEffect, useState } from "react"
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
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success"
  })

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
    try {
      if (liked) {
        await unfollowProduct(product.id)
        setLiked(false)
      } else {
        await followProduct(product.id)
        setLiked(true)
      }
    } catch (err) {
      console.error(err)
    }
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
        <Link to="/home">Trang chủ</Link>
        <span className="mx-2">/</span>
        <Link to="/product">Cửa hàng</Link>
        <span className="mx-2">/</span>
        <span>{product.name}</span>
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16 px-4 md:px-36">
        <div className="w-full md:w-160">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full aspect-square object-cover md:h-160 md:w-160 mb-4"
          />

          <div className="flex gap-3 overflow-x-auto md:overflow-visible">
            {allImages.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                onClick={() => setMainImage(img)}
                className={`h-20 w-20 md:h-27 md:w-27 cursor-pointer border flex-shrink-0 ${
                  mainImage === img ? "border-black" : "border-transparent"
                }`}
              />
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
              <button onClick={decrease} className="px-4 py-3 border-r">
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
              <button onClick={increase} className="px-4 py-3 border-l">
                +
              </button>
            </div>

            <button onClick={toggleFollow} className="border p-3">
              <Heart className={liked ? "fill-red-500 text-red-500" : "text-gray-400"} />
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="w-full border py-3 font-futura-regular transition flex items-center justify-center gap-2"
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
            <Link key={p.id} to={`/product/detail/${p.id}`}>
              <div className="bg-[#f7f7f7] p-3">
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