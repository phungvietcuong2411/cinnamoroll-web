import { useState } from "react"
import { X } from "lucide-react"
import { Link } from "react-router-dom"
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"

const CLOUDINARY =
  "https://res.cloudinary.com/dhjs4exbp/image/upload/v1766834099/"

const orders = [
  {
    id: "ORD001",
    date: "2025-01-02",
    status: "Processing",
    address: "123 Nguyen Trai, District 1, HCM",
    payment: "COD",
    total: 320000,
    items: [
      {
        id: 1,
        name: 'Cinnamoroll 12" Plush',
        price: 100000,
        qty: 2,
        image: "image_66_acnsx0.jpg"
      },
      {
        id: 2,
        name: "Kuromi Plush",
        price: 120000,
        qty: 1,
        image: "image_64_ndweuj.jpg"
      }
    ]
  }
]

const statusColor = status => {
  switch (status) {
    case "Processing":
      return "text-yellow-600"
    case "Shipping":
      return "text-blue-600"
    case "Completed":
      return "text-green-600"
    default:
      return "text-gray-500"
  }
}

function Order() {
  const [selectedOrder, setSelectedOrder] = useState(null)

  return (
    <>
      <Header />
      <div className="h-16" />

      <div className="h-24 flex items-center justify-center">
        <h1 className="font-frankfurter text-3xl md:text-5xl">
          My Orders
        </h1>
      </div>

      {/* ORDER LIST */}
      <div className="px-4 md:px-36 mb-20 space-y-6 font-futura-regular">
        {orders.map(order => (
          <div key={order.id} className="border p-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-sm">
                  Order ID: <b>{order.id}</b>
                </p>
                <p className="text-xs text-gray-500">{order.date}</p>
              </div>
              <span className={statusColor(order.status)}>
                {order.status}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm">
                Total:{" "}
                <span className="font-frankfurter">
                  {order.total.toLocaleString()} VND
                </span>
              </p>

              <button
                onClick={() => setSelectedOrder(order)}
                className="border px-4 py-2 text-sm"
              >
                View detail
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= MODAL ================= */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
          <div className="bg-white w-[95%] md:w-[700px] max-h-[90vh] overflow-y-auto p-5 relative font-futura-regular">

            {/* CLOSE */}
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute right-4 top-4"
            >
              <X />
            </button>

            <h2 className="font-frankfurter text-2xl mb-4">
              Order Detail
            </h2>

            {/* INFO */}
            <div className="text-sm space-y-1 mb-4">
              <p><b>Order ID:</b> {selectedOrder.id}</p>
              <p><b>Date:</b> {selectedOrder.date}</p>
              <p>
                <b>Status:</b>{" "}
                <span className={statusColor(selectedOrder.status)}>
                  {selectedOrder.status}
                </span>
              </p>
              <p><b>Payment:</b> {selectedOrder.payment}</p>
              <p><b>Shipping address:</b> {selectedOrder.address}</p>
            </div>

            {/* ITEMS */}
            <div className="border-t pt-4 space-y-4">
              {selectedOrder.items.map(item => (
                <div key={item.id} className="flex gap-4">
                  <Link to={`/product/detail/${item.id}`}>
                    <img
                      src={CLOUDINARY + item.image}
                      className="w-20 h-20 rounded object-cover"
                    />
                  </Link>

                  <div className="flex-1">
                    <Link
                      to={`/product/detail/${item.id}`}
                      className="text-sm hover:underline"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-gray-500">
                      {item.price.toLocaleString()} VND × {item.qty}
                    </p>
                  </div>

                  <div className="font-frankfurter text-sm">
                    {(item.price * item.qty).toLocaleString()} VND
                  </div>
                </div>
              ))}
            </div>

            {/* TOTAL */}
            <div className="border-t mt-4 pt-4 flex justify-between">
              <span>Total</span>
              <span className="font-frankfurter text-lg">
                {selectedOrder.total.toLocaleString()} VND
              </span>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}

export default Order
