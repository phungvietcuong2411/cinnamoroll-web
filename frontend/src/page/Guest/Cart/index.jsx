import { useState } from "react"
import { Link } from "react-router-dom"
import { Trash2, Plus, Minus } from "lucide-react"
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"

const CLOUDINARY =
  "https://res.cloudinary.com/dhjs4exbp/image/upload/v1766834099/"

/* ===== TEMP CART DATA ===== */
const initialCart = [
  {
    id: 1,
    name: 'Cinnamoroll 12" Plush',
    price: 100000,
    qty: 2,
    stock: 12,
    image: "image_66_acnsx0.jpg"
  },
  {
    id: 2,
    name: "Kuromi Plush",
    price: 120000,
    qty: 1,
    stock: 8,
    image: "image_64_ndweuj.jpg"
  }
]

function Cart() {
  const [cart, setCart] = useState(initialCart)

  const increase = id => {
    setCart(prev =>
      prev.map(item =>
        item.id === id && item.qty < item.stock
          ? { ...item, qty: item.qty + 1 }
          : item
      )
    )
  }

  const decrease = id => {
    setCart(prev =>
      prev.map(item =>
        item.id === id && item.qty > 1
          ? { ...item, qty: item.qty - 1 }
          : item
      )
    )
  }

  const removeItem = id => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  )

  return (
    <>
      <Header />
      <div className="h-16" />

      {/* ===== TITLE ===== */}
      <div className="h-24 flex items-center justify-center">
        <h1 className="font-frankfurter text-3xl md:text-5xl">
          Shopping Cart
        </h1>
      </div>

      {/* ===== DESKTOP TABLE ===== */}
      <div className="hidden md:block px-10">
        <table className="w-full font-futura-regular">
          <thead className="text-lg border-b">
            <tr>
              <th className="text-left py-4 w-1/2">Product</th>
              <th className="py-4">Price</th>
              <th className="py-4">Quantity</th>
              <th className="py-4">Total</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {cart.map(item => (
              <tr key={item.id} className="border-b">
                <td className="py-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={CLOUDINARY + item.image}
                      alt={item.name}
                      className="h-24 w-24 object-cover"
                    />
                    <span>{item.name}</span>
                  </div>
                </td>

                <td className="text-center">
                  {item.price.toLocaleString()} VND
                </td>

                <td className="text-center">
                  <div className="inline-flex border">
                    <button
                      onClick={() => decrease(item.id)}
                      className="px-3 py-2 border-r"
                    >
                      <Minus size={14} />
                    </button>
                    <div className="px-4 py-2">
                      {item.qty}
                    </div>
                    <button
                      onClick={() => increase(item.id)}
                      className="px-3 py-2 border-l"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </td>

                <td className="text-center">
                  {(item.price * item.qty).toLocaleString()} VND
                </td>

                <td className="text-center">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== MOBILE CART ===== */}
      <div className="md:hidden px-4 space-y-6">
        {cart.map(item => (
          <div
            key={item.id}
            className="border p-4 rounded-lg font-futura-regular"
          >
            <div className="flex gap-4 mb-4">
              <img
                src={CLOUDINARY + item.image}
                alt={item.name}
                className="h-24 w-24 object-cover"
              />

              <div className="flex-1">
                <p className="mb-1">{item.name}</p>
                <p className="text-sm mb-2">
                  {item.price.toLocaleString()} VND
                </p>

                <div className="flex items-center gap-3">
                  <div className="flex border">
                    <button
                      onClick={() => decrease(item.id)}
                      className="px-3 py-2 border-r"
                    >
                      -
                    </button>
                    <div className="px-4 py-2">
                      {item.qty}
                    </div>
                    <button
                      onClick={() => increase(item.id)}
                      className="px-3 py-2 border-l"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <span>Total</span>
              <span className="font-bold">
                {(item.price * item.qty).toLocaleString()} VND
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ===== CART SUMMARY ===== */}
      <div className="px-4 md:px-10 my-10 flex flex-col md:flex-row justify-end">
        <div className="w-full md:w-96 border p-6 font-futura-regular">
          <div className="flex justify-between mb-4">
            <span>Subtotal</span>
            <span>{totalPrice.toLocaleString()} VND</span>
          </div>

          <Link
            to="/checkout"
            className="w-full bg-black text-white py-3 px-3 font-frankfurter">
            Checkout
          </Link>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default Cart
