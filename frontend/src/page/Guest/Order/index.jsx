import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Link } from "react-router-dom"

import Header from "../../../components/Header"
import Footer from "../../../components/Footer"

import { getMyOrders, cancelOrder } from "../../../services/order.service"
import { getOrderProductsByOrder } from "../../../services/orderProduct.service"

/* ================= STATUS UI ================= */
const statusText = {
  preparing: "Preparing",
  processing: "Processing",
  completed: "Completed",
  cancelled: "Cancelled"
}

const statusColor = (status) => {
  switch (status) {
    case "preparing":
      return "text-yellow-600"
    case "processing":
      return "text-blue-600"
    case "completed":
      return "text-green-600"
    case "cancelled":
      return "text-red-600"
    default:
      return "text-gray-500"
  }
}

/* ================= DATE FORMAT ================= */
const formatDateVN = (date) => {
  const d = new Date(date)
  d.setHours(d.getHours() + 7)
  return d.toLocaleString("vi-VN")
}


function Order() {
  /* ================= STATE ================= */
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)

  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orderItems, setOrderItems] = useState([])
  const [loadingDetail, setLoadingDetail] = useState(false)

  const [cancelTarget, setCancelTarget] = useState(null)
  const [cancelLoading, setCancelLoading] = useState(false)

  const [message, setMessage] = useState(null)

  /* ================= FETCH ORDERS ================= */
  const fetchOrders = async () => {
    try {
      setLoadingOrders(true)
      const res = await getMyOrders()
      setOrders(res.data || [])
    } catch (err) {
      console.error(err)
      setMessage("Không thể tải danh sách đơn hàng")
    } finally {
      setLoadingOrders(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  /* ================= OPEN ORDER DETAIL ================= */
  const openOrderDetail = async (order) => {
    try {
      setSelectedOrder(order)
      setOrderItems([])
      setLoadingDetail(true)

      const res = await getOrderProductsByOrder(order.id)
      setOrderItems(res.data || [])
    } catch (err) {
      console.error(err)
      setMessage("Không thể tải chi tiết đơn hàng")
    } finally {
      setLoadingDetail(false)
    }
  }

  /* ================= CLOSE MODAL ================= */
  const closeModal = () => {
    setSelectedOrder(null)
    setOrderItems([])
  }

  /* ================= CANCEL ORDER ================= */
  const handleCancelOrder = async () => {
    if (!cancelTarget) return

    try {
      setCancelLoading(true)
      await cancelOrder(cancelTarget.id)

      // đóng modal
      setCancelTarget(null)
      setSelectedOrder(null)

      // reload orders
      await fetchOrders()
    } catch (err) {
      console.error("Cancel order failed:", err)
    } finally {
      setCancelLoading(false)
    }
  }

  return (
    <>
      <Header />
      <div className="h-16" />

      {/* ================= TITLE ================= */}
      <div className="h-24 flex items-center justify-center">
        <h1 className="font-frankfurter text-3xl md:text-5xl">
          My Orders
        </h1>
      </div>

      {/* ================= LIST ORDERS ================= */}
      <div className="px-4 md:px-36 mb-20 space-y-6 font-futura-regular">
        {loadingOrders && (
          <p className="text-center text-gray-500">
            Loading orders...
          </p>
        )}

        {message && (
          <p className="text-center text-red-600">
            {message}
          </p>
        )}

        {!loadingOrders && orders.length === 0 && (
          <p className="text-center text-gray-500">
            Bạn chưa có đơn hàng nào
          </p>
        )}

        {orders.map(order => (
          <div key={order.id} className="border p-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-sm">
                  Order ID: <b>#{order.id}</b>
                </p>
                <p className="text-xs text-gray-500">
                  {formatDateVN(order.order_date)}
                </p>
              </div>

              <span className={statusColor(order.status)}>
                {statusText[order.status]}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm">
                Total:{" "}
                <span className="font-frankfurter">
                  {order.price.toLocaleString()} VND
                </span>
              </p>

              <div className="flex gap-4">
                {order.status === "preparing" && (
                  <button
                    onClick={() => setCancelTarget(order)}
                    className="border px-4 py-2 text-sm text-red-600 border-red-600 hover:bg-red-600 hover:text-white transition"
                  >
                    Cancel
                  </button>
                )}

                <button
                  onClick={() => openOrderDetail(order)}
                  className="border px-4 py-2 text-sm hover:bg-black hover:text-white transition"
                >
                  View detail
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= ORDER DETAIL MODAL ================= */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
          <div className="bg-white w-[95%] md:w-[700px] max-h-[90vh] overflow-y-auto p-5 relative font-futura-regular">
            <button
              onClick={closeModal}
              className="absolute right-4 top-4"
            >
              <X />
            </button>

            <h2 className="font-frankfurter text-2xl mb-4">
              Order Detail
            </h2>

            <div className="text-sm space-y-1 mb-4">
              <p><b>Order ID:</b> #{selectedOrder.id}</p>
              <p><b>Date:</b> {formatDateVN(selectedOrder.order_date)}</p>
              <p>
                <b>Status:</b>{" "}
                <span className={statusColor(selectedOrder.status)}>
                  {statusText[selectedOrder.status]}
                </span>
              </p>
              <p><b>Payment:</b> {selectedOrder.payment_method}</p>
              <p><b>Shipping:</b> {selectedOrder.shipping_address}</p>
            </div>

            <div className="border-t pt-4 space-y-4">
              {loadingDetail && (
                <p className="text-center text-gray-500 text-sm">
                  Loading order items...
                </p>
              )}

              {!loadingDetail && orderItems.length === 0 && (
                <p className="text-center text-gray-500 text-sm">
                  Đơn hàng không có sản phẩm
                </p>
              )}

              {orderItems.map(item => (
                <div key={item.id} className="flex gap-4">
                  <Link to={`/product/detail/${item.idProduct}`}>
                    <img
                      src={item.imgMain}
                      alt={item.name}
                      className="w-20 h-20 rounded object-cover"
                    />
                  </Link>

                  <div className="flex-1">
                    <Link
                      to={`/product/detail/${item.idProduct}`}
                      className="text-sm hover:underline"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-gray-500">
                      {item.price.toLocaleString()} VND × {item.quantity}
                    </p>
                  </div>

                  <div className="font-frankfurter text-sm">
                    {(item.price * item.quantity).toLocaleString()} VND
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t mt-4 pt-4 flex justify-between">
              <span>Total</span>
              <span className="font-frankfurter text-lg">
                {selectedOrder.price.toLocaleString()} VND
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ================= CANCEL CONFIRM MODAL ================= */}
      {cancelTarget && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
          <div className="bg-white p-6 w-[90%] md:w-[400px] text-center">
            <h3 className="text-lg font-bold mb-4">
              Bạn có chắc muốn hủy đơn hàng #{cancelTarget.id}?
            </h3>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setCancelTarget(null)}
                className="border px-4 py-2"
              >
                Không
              </button>

              <button
                onClick={handleCancelOrder}
                disabled={cancelLoading}
                className="bg-red-600 text-white px-4 py-2"
              >
                {cancelLoading ? "Đang hủy..." : "Hủy đơn"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}

export default Order
