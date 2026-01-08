import { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import { Trash2, Plus, Minus, X } from "lucide-react"
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
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

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

  const increase = item => updateQuantity(item, item.quantity + 1)
  const decrease = item => updateQuantity(item, item.quantity - 1)

  const openDeleteModal = (item) => {
    setItemToDelete(item)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!itemToDelete) return

    try {
      await removeFromCart(itemToDelete.productId)
      setCart(prev => prev.filter(i => i.productId !== itemToDelete.productId))
    } catch (err) {
      console.error("Remove cart failed", err)
    } finally {
      setShowDeleteModal(false)
      setItemToDelete(null)
    }
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
    setItemToDelete(null)
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
        <div className="h-32 flex items-center justify-center font-futura-regular text-xl">
          Đang tải giỏ hàng...
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="h-16" />

      <div className="h-24 flex items-center justify-center px-4">
        <h1 className="font-futura-regular text-3xl md:text-5xl text-center">
          GIỎ HÀNG CỦA BẠN
        </h1>
      </div>

      {/* ================ MOBILE VERSION ================ */}
      <div className="block md:hidden px-4 space-y-6 pb-8 font-futura-regular">
        {cart.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Giỏ hàng của bạn đang trống.
          </div>
        ) : (
          cart.map(item => (
            <div
              key={item.productId}
              className="bg-white rounded-lg shadow-md p-4 flex gap-4 font-futura-regular"
            >
              <img
                src={item.imgMain}
                alt={item.name}
                className="w-28 h-28 object-cover rounded-lg flex-shrink-0"
              />

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-medium text-lg line-clamp-2">{item.name}</h3>
                  <p className="text-gray-600 mt-1">
                    {Number(item.price).toLocaleString()} VND
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="inline-flex border items-center font-frankfurter">
                    <button
                      onClick={() => decrease(item)}
                      className="px-3 py-2 border-r"
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={e => {
                        const value = Number(e.target.value)
                        if (!isNaN(value) && value > 0) {
                          updateQuantity(item, value)
                        }
                      }}
                      className="w-16 text-center outline-none font-medium"
                    />
                    <button
                      onClick={() => increase(item)}
                      className="px-3 py-2 border-l"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button
                    onClick={() => openDeleteModal(item)}
                    className="text-red-500 p-2"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="text-right mt-3 font-medium">
                  {(item.quantity * Number(item.price)).toLocaleString()} VND
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================ DESKTOP VERSION ================ */}
      <div className="hidden md:block px-10 mb-10 font-futura-regular">
        {cart.length === 0 ? (
          <div className="text-center py-16 text-gray-500 text-xl">
            Giỏ hàng của bạn đang trống.
          </div>
        ) : (
          <table className="w-full font-futura-regular">
            <thead className="border-b-2 border-gray-300">
              <tr>
                <th className="text-left py-6 w-1/2">Sản phẩm</th>
                <th className="text-center py-6">Giá tiền</th>
                <th className="text-center py-6">Số lượng</th>
                <th className="text-center py-6">Tổng tiền</th>
                <th className="text-center py-6"></th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.productId} className="border-b">
                  <td className="py-8">
                    <div className="flex items-center gap-6">
                      <img
                        src={item.imgMain}
                        alt={item.name}
                        className="h-28 w-28 object-cover rounded-lg"
                      />
                      <span className="font-medium text-lg">{item.name}</span>
                    </div>
                  </td>
                  <td className="text-center font-medium">
                    {Number(item.price).toLocaleString()} VND
                  </td>
                  <td className="text-center">
                    <div className="inline-flex border items-center font-frankfurter">
                      <button
                        onClick={() => decrease(item)}
                        className="px-4 py-3 border-r hover:bg-gray-100"
                      >
                        <Minus size={16} />
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={e => {
                          const value = Number(e.target.value)
                          if (!isNaN(value) && value > 0) {
                            updateQuantity(item, value)
                          }
                        }}
                        className="w-20 text-center outline-none font-medium"
                      />
                      <button
                        onClick={() => increase(item)}
                        className="px-4 py-3 border-l hover:bg-gray-100"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </td>
                  <td className="text-center font-medium">
                    {(item.quantity * Number(item.price)).toLocaleString()} VND
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => openDeleteModal(item)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <Trash2 size={22} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ================ TỔNG TIỀN & CHECKOUT ================ */}
      {cart.length > 0 && (
        <div className="px-4 md:px-10 my-12 font-futura-regular">
          <div className="max-w-md ml-auto bg-gray-50 p-6 md:p-8 border">
            <div className="flex justify-between text-xl font-medium mb-6">
              <span>Tổng tiền</span>
              <span>{totalPrice.toLocaleString()} VND</span>
            </div>

            <Link
              to="/checkout"
              className="block text-center bg-black text-white py-4 text-lg hover:bg-gray-800 transition"
            >
              TIẾN HÀNH THANH TOÁN
            </Link>
          </div>
        </div>
      )}


      {/* ================ MODAL XÁC NHẬN XÓA ================ */}
      {showDeleteModal && itemToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              onClick={cancelDelete}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>

            <h3 className="text-xl font-bold text-red-600 mb-4">
              Xác nhận xóa sản phẩm
            </h3>

            <p className="text-gray-700 mb-6">
              Bạn có chắc chắn muốn xóa <strong>"{itemToDelete.name}"</strong> khỏi giỏ hàng?
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={cancelDelete}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}

export default Cart