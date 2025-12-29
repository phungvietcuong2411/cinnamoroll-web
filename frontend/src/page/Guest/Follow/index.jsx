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
        setFollowList(res.data)
      } catch (err) {
        console.error("Fetch follows failed", err)
      } finally {
        setLoading(false)
      }
    }

    fetchFollows()
  }, [])

  const removeItem = async (productId) => {
    try {
      await unfollowProduct(productId)
      setFollowList(prev =>
        prev.filter(item => item.productId !== productId)
      )
    } catch (err) {
      console.error("Unfollow failed", err)
    }
  }


  return (
    <>
      <Header />
      <div className="h-16" />

      {/* ===== TITLE ===== */}
      <div className="h-24 flex items-center justify-center">
        <h1 className="font-frankfurter text-3xl md:text-5xl">
          My Favorites
        </h1>
      </div>

      {/* ===== EMPTY STATE ===== */}
      {followList.length === 0 && (
        <div className="text-center my-20 font-futura-regular">
          <Heart className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-lg mb-2">
            Your favorites list is empty
          </p>
          <Link
            to="/home"
            className="underline text-sm"
          >
            Continue shopping
          </Link>
        </div>
      )}

      {/* ===== PRODUCT GRID ===== */}
      {followList.length > 0 && (
        <div className="px-4 md:px-36 my-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {followList.map(item => (
              <div
                key={item.productId}
                className="relative font-futura-regular"
              >
                {/* REMOVE */}
                <button
                  onClick={() => removeItem(item.productId)}
                  className="absolute top-3 right-3 z-10 bg-white p-2 rounded-full shadow"
                >
                  <Trash2 size={16} />
                </button>

                <Link to={`/product/detail/${item.productId}`}>
                  <div className="bg-[#f7f7f7] p-3">
                    <img
                      src={item.imgMain}
                      alt={item.name}
                      className="rounded-lg aspect-square object-cover mb-3"
                    />

                    <p className="text-sm mb-2 line-clamp-2">
                      {item.name}
                    </p>

                    <p className="font-frankfurter text-sm mb-2">
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
