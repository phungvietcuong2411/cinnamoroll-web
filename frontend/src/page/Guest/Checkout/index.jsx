import { useEffect, useState } from "react"
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import { jwtDecode } from "jwt-decode"
import { getCart } from "../../../services/cart.service"
import { getUserById } from "../../../services/user.service"
import { createPayment } from "../../../services/vnpay.service"
import { createOrder, createOrderVNpay } from "../../../services/order.service"
import {
  createOrderProducts,
  createOrderProductsVNPay
} from "../../../services/orderProduct.service"

function Checkout() {
  const token = localStorage.getItem("token")
  const decoded = token ? jwtDecode(token) : null
  const userId = decoded?.id

  const [loading, setLoading] = useState(false)
  const [payment, setPayment] = useState("COD")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [countdown, setCountdown] = useState(10)
  const [cartItems, setCartItems] = useState([])

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  })

  const [message, setMessage] = useState(null)

  /* ================= FETCH USER ================= */
  useEffect(() => {
    if (!userId) return

    const fetchUser = async () => {
      try {
        const res = await getUserById(userId)
        setCustomer({
          name: res.data.name || "",
          email: res.data.gmail || "",
          phone: res.data.phone || "",
          address: res.data.address || ""
        })
      } catch (err) {
        console.error(err)
        setMessage({
          type: "error",
          text: "Không thể tải thông tin người dùng"
        })
      }
    }

    fetchUser()
  }, [userId])

  useEffect(() => {
    if (!orderSuccess) return

    const timer = setInterval(() => {
      setCountdown(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [orderSuccess])

  /* ================= FETCH CART ================= */
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true)
        const res = await getCart()
        setCartItems(res.data || [])
      } catch (err) {
        console.error(err)
        setMessage({
          type: "error",
          text: "Không thể tải giỏ hàng"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [])

  /* ================= CALCULATE ================= */
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const shippingFee = cartItems.length ? 30000 : 0
  const total = subtotal + shippingFee

  /* ================= HANDLERS ================= */
  const handleCustomerChange = e => {
    setCustomer(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

const handleSubmit = async e => {
  e.preventDefault()
  if (!cartItems.length || isSubmitting) return

  try {
    setIsSubmitting(true)
    setLoading(true)
    setMessage(null)

    const cartIds = cartItems.map(item => item.id)

    /* ================= COD ================= */
    if (payment === "COD") {
      const orderRes = await createOrder({
        paymentMethod: "COD",
        shippingAddress: customer.address,
        price: total
      })

      const orderId = orderRes.data.id

      await createOrderProducts({ orderId, cartIds })

      setOrderSuccess(true)
      setMessage({
        type: "success",
        text: "Đặt hàng thành công! Cảm ơn bạn."
      })

      setTimeout(() => {
        window.location.href = "/home"
      }, 10000)

      return
    }

    /* ================= VNPAY ================= */
    if (payment === "VNPAY") {
      const orderRes = await createOrderVNpay({
        paymentMethod: "VNPAY",
        shippingAddress: customer.address,
        price: total
      })

      const orderId = orderRes.data.id

      const payRes = await createPayment({
        orderId,
        totalPrice: total
      })

      window.location.href = payRes.data.paymentUrl
    }

  } catch (err) {
    console.error(err)
    setMessage({
      type: "error",
      text: "Đặt hàng thất bại, vui lòng thử lại"
    })
    setIsSubmitting(false)
  } finally {
    setLoading(false)
  }
}



  return (
    <>
      <Header />
      <div className="h-16" />

      <div className="px-4 md:px-36 py-10 font-futura-regular min-h-screen">
        <h1 className="font-frankfurter text-3xl md:text-5xl mb-8 text-center">
          Checkout
        </h1>

        {message && (
          <div
            className={`mb-6 p-3 border text-sm
              ${message.type === "error"
                ? "bg-red-50 text-red-700 border-red-300"
                : "bg-green-50 text-green-700 border-green-300"
              }`}
          >
            {message.text}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-10"
        >
          {/* ================= LEFT ================= */}
          <div className="space-y-6">
            {/* CUSTOMER INFO */}
            <div>
              <h2 className="font-futura-regular text-xl mb-3">
                Thông tin cá nhân
              </h2>

              <div className="space-y-3">
                <input
                  required
                  name="name"
                  value={customer.name}
                  onChange={handleCustomerChange}
                  placeholder="Full name"
                  className="w-full border p-3 outline-none"
                />

                <input
                  required
                  name="phone"
                  value={customer.phone}
                  onChange={handleCustomerChange}
                  placeholder="Phone number"
                  className="w-full border p-3 outline-none"
                />

                <input
                  type="email"
                  required
                  name="email"
                  value={customer.email}
                  onChange={handleCustomerChange}
                  placeholder="Email"
                  className="w-full border p-3 outline-none"
                />
              </div>
            </div>

            {/* ADDRESS */}
            <div>
              <h2 className="font-futura-regular text-xl mb-3">
                Nơi giao hàng
              </h2>

              <input
                required
                name="address"
                value={customer.address}
                onChange={handleCustomerChange}
                placeholder="Street address"
                className="w-full border p-3 outline-none"
              />
            </div>

            {/* PAYMENT */}
            <div>
              <h2 className="font-futura-regular text-xl mb-3">
                Phương thức thanh toán
              </h2>

              <div className="space-y-3">
                <label className="flex items-center gap-3 border p-3 cursor-pointer">
                  <input
                    type="radio"
                    checked={payment === "COD"}
                    onChange={() => setPayment("COD")}
                  />
                  Nhận hàng thanh toán (COD)
                </label>

                <label className="flex items-center gap-3 border p-3 cursor-pointer">
                  <input
                    type="radio"
                    checked={payment === "VNPAY"}
                    onChange={() => setPayment("VNPAY")}
                  />
                  VNPAY
                </label>
              </div>
            </div>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="border p-5 h-fit">
            <h2 className="font-frankfurter text-xl mb-4">
              Tóm tắt đơn hàng
            </h2>

            {loading && (
              <p className="text-sm text-gray-500 mb-4">
                Đang tải...
              </p>
            )}

            <div className="space-y-4 mb-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-3">
                  <img
                    src={item.imgMain}
                    className="w-16 h-16 rounded object-cover"
                  />

                  <div className="flex-1">
                    <p className="text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.price.toLocaleString()} VND ×{" "}
                      {item.quantity}
                    </p>
                  </div>

                  <div className="text-sm">
                    {(item.price * item.quantity).toLocaleString()} VND
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Giá tiền</span>
                <span>{subtotal.toLocaleString()} VND</span>
              </div>

              <div className="flex justify-between">
                <span>Tiền ship</span>
                <span>{shippingFee.toLocaleString()} VND</span>
              </div>

              <div className="flex justify-between font-frankfurter text-lg">
                <span>Tổng tiền</span>
                <span>{total.toLocaleString()} VND</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={!cartItems.length || isSubmitting || orderSuccess}
              className={`w-full py-4 mt-6 font-frankfurter transition
                  ${isSubmitting || orderSuccess
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black text-white hover:opacity-90"
                }`}
            >
              {isSubmitting
                ? "Đang xử lý..."
                : orderSuccess
                  ? "Đặt hàng thành công"
                  : "Place Order"
              }
            </button>
            {orderSuccess && (
              <p className="text-center text-sm text-gray-500 mt-3">
                Tự động về trang chủ sau {countdown}s
              </p>
            )}

          </div>
        </form>
      </div>

      <Footer />
    </>
  )
}

export default Checkout
