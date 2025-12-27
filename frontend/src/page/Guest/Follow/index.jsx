import { useState } from "react"
import { Heart, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"

const CLOUDINARY =
  "https://res.cloudinary.com/dhjs4exbp/image/upload/v1766834099/"

/* ===== TEMP FOLLOW DATA ===== */
const initialFollow = [
  {
    id: 1,
    name: 'Cinnamoroll 12" Plush',
    price: 100000,
    image: "image_66_acnsx0.jpg",
    stock: 12
  },
  {
    id: 2,
    name: "Kuromi Plush",
    price: 120000,
    image: "image_64_ndweuj.jpg",
    stock: 5
  },
  {
    id: 3,
    name: "My Melody Plush",
    price: 95000,
    image: "image_50_ueejft.jpg",
    stock: 0
  }
]

function Follow() {
  const [followList, setFollowList] = useState(initialFollow)

  const removeItem = id => {
    setFollowList(prev => prev.filter(item => item.id !== id))
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
                key={item.id}
                className="relative font-futura-regular"
              >
                {/* REMOVE */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute top-3 right-3 z-10 bg-white p-2 rounded-full shadow"
                >
                  <Trash2 size={16} />
                </button>

                <Link to={`/product/detail/${item.id}`}>
                  <div className="bg-[#f7f7f7] p-3">
                    <img
                      src={CLOUDINARY + item.image}
                      alt={item.name}
                      className="rounded-lg aspect-square object-cover mb-3"
                    />

                    <p className="text-sm mb-2 line-clamp-2">
                      {item.name}
                    </p>

                    <p className="font-frankfurter text-sm mb-2">
                      {item.price.toLocaleString()} VND
                    </p>

                    {/* STOCK */}
                    {item.stock > 0 ? (
                      <p className="text-xs text-green-600">
                        In stock ({item.stock})
                      </p>
                    ) : (
                      <p className="text-xs text-red-500">
                        Out of stock
                      </p>
                    )}
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
