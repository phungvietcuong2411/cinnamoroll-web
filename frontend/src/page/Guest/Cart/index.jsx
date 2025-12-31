import { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import { Trash2, Plus, Minus } from "lucide-react"
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import {
  getCart,
  updateCart,
  removeFromCart
} from "../../../services/cart.service"

function Cart() {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)

  const debounceMap = useRef({})

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true)
        const res = await getCart()
        setCart(res.data || [])
      } catch (err) {
        console.error("Get cart failed", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [])

  const updateQuantity = (item, newQty) => {
    if (newQty < 1) return

    setCart(prev =>
      prev.map(i =>
        i.productId === item.productId
          ? { ...i, quantity: newQty }
          : i
      )
    )

    if (debounceMap.current[item.productId]) {
      clearTimeout(debounceMap.current[item.productId])
    }

    debounceMap.current[item.productId] = setTimeout(async () => {
      try {
        await updateCart(item.productId, newQty)
      } catch (err) {
        console.error("Update cart failed", err)
      }
    }, 600)
  }

  const increase = item => {
    updateQuantity(item, item.quantity + 1)
  }

  const decrease = item => {
    updateQuantity(item, item.quantity - 1)
  }

  const removeItem = async (productId) => {
    try {
      await removeFromCart(productId)
      setCart(prev => prev.filter(i => i.productId !== productId))
    } catch (err) {
      console.error("Remove cart failed", err)
    }
  }

  const totalPrice = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  )

  if (loading) {
    return (
      <>
        <Header />
        <div className="h-16"></div>
        <div className="h-32 flex items-center justify-center font-futura-regular">
          Đang tải
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="h-16" />

      <div className="h-24 flex items-center justify-center">
        <h1 className="font-futura-regular text-3xl md:text-5xl">
          GIỎ HÀNG CỦA BẠN
        </h1>
      </div>

      <div className="hidden md:block px-10">
        <table className="w-full font-futura-regular">
          <thead className="border-b">
            <tr>
              <th className="text-left py-4 w-1/2">Sản phẩm</th>
              <th>Giá tiền</th>
              <th>Số lượng</th>
              <th>Tổng tiền</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {cart.map(item => (
              <tr key={item.productId} className="border-b">
                <td className="py-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.imgMain}
                      alt={item.name}
                      className="h-24 w-24 object-cover"
                    />
                    <span>{item.name}</span>
                  </div>
                </td>

                <td className="text-center">
                  {Number(item.price).toLocaleString()} VND
                </td>

                <td className="text-center">
                  <div className="inline-flex border items-center">
                    <button
                      onClick={() => decrease(item)}
                      className="px-3 py-2 border-r"
                    >
                      <Minus size={14} />
                    </button>

                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={e => {
                        const value = Number(e.target.value)
                        if (isNaN(value)) return
                        updateQuantity(item, value)
                      }}
                      className="w-16 text-center outline-none"
                    />

                    <button
                      onClick={() => increase(item)}
                      className="px-3 py-2 border-l"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </td>

                <td className="text-center">
                  {(item.quantity * Number(item.price)).toLocaleString()} VND
                </td>

                <td className="text-center">
                  <button
                    onClick={() => removeItem(item.productId)}
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

      <div className="px-4 md:px-10 my-10 flex justify-end">
        <div className="w-full md:w-96 border p-6 font-futura-regular">
          <div className="flex justify-between mb-4">
            <span>Tổng tiền</span>
            <span>{totalPrice.toLocaleString()} VND</span>
          </div>

          <Link
            to="/checkout"
            className="block text-center bg-black text-white py-3 font-frankfurter"
          >
            Checkout
          </Link>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default Cart