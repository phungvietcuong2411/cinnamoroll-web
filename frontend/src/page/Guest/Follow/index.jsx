import { useState, useEffect } from "react"
import { Heart, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import {
  getMyFollows,
  unfollowProduct
} from "../../../services/follow.service"

function Follow() {
  const [followList, setFollowList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFollows = async () => {
      try {
        const res = await getMyFollows()
        setFollowList(res.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchFollows()
  }, [])

  const removeItem = async (productId) => {
    try {
      await unfollowProduct(productId)
      setFollowList(prev => prev.filter(item => item.productId !== productId))
    } catch (err) {
      console.error(err)
    }
  }

  const hasItems = followList.length > 0

  return (
    <>
      <Header />
      <div className="h-16" />

      <div className="h-24 flex items-center justify-center">
        <h1 className="font-futura-regular text-3xl md:text-5xl">
          SẢN PHẨM BẠN YÊU THÍCH
        </h1>
      </div>

      {!hasItems && !loading && (
        <div className="text-center my-20 font-futura-regular">
          <Heart className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-lg mb-2">Danh sách yêu thích trống</p>
          <Link to="/home" className="underline text-sm">
            Tiếp tục mua sắm
          </Link>
        </div>
      )}

      {hasItems && (
        <div className="px-4 md:px-36 my-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {followList.map(item => (
              <div key={item.productId} className="relative font-futura-regular group">
                <button
                  onClick={() => removeItem(item.productId)}
                  className="absolute top-3 right-3 z-10 bg-white p-2 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>

                <Link to={`/product/detail/${item.productId}`}>
                  <div className="bg-[#f7f7f7] p-3 flex flex-col justify-between h-full">
                    <img
                      src={item.imgMain}
                      alt={item.name}
                      className="rounded-lg aspect-square object-cover mb-3"
                    />
                    <p className="text-sm mb-2 line-clamp-2">{item.name}</p>
                    <p className="font-frankfurter text-sm">
                      {Number(item.price).toLocaleString()} VND
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}

export default Follow