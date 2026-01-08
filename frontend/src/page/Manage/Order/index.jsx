import { useEffect, useState } from "react"
import AdminLayout from "../../../layouts/AdminLayout"
import { Search, Eye, Pencil, Check, X } from "lucide-react"
import {
  getAllOrders,
  updateOrderStatus,
} from "../../../services/order.service"

/* ================== CONFIG ================== */

const PAGE_SIZE = 20

const STATUS_LABEL = {
  pending_payment: "Chờ thanh toán",
  paid: "Đã thanh toán",
  preparing: "Đang chuẩn bị",
  processing: "Đang giao",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
}

const STATUS_COLOR = {
  pending_payment: "bg-yellow-100 text-yellow-700",
  paid: "bg-green-100 text-green-700",
  preparing: "bg-blue-100 text-blue-700",
  processing: "bg-indigo-100 text-indigo-700",
  completed: "bg-gray-200 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
}

const STATUS_FLOW = {
  pending_payment: ["paid", "cancelled"],
  paid: ["processing"],
  preparing: ["processing", "cancelled"],
  processing: ["completed"],
  completed: [],
  cancelled: [],
}

const formatDateTime = (date) =>
  new Date(date).toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour12: false,
  })

/* ================== COMPONENT ================== */

function OrderManagement() {
  /* data */
  const [orders, setOrders] = useState([])

  /* search & filter */
  const [keyword, setKeyword] = useState("")
  const [paymentFilter, setPaymentFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  /* pagination */
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 1,
  })

  /* edit status */
  const [editingId, setEditingId] = useState(null)
  const [nextStatus, setNextStatus] = useState("")

  /* ================== FETCH ================== */

  const fetchOrders = async () => {
    const res = await getAllOrders({
      page,
      limit: PAGE_SIZE,
      paymentMethod: paymentFilter,
      status: statusFilter,
      keyword,
    })

    setOrders(res.data.data)
    setPagination(res.data.pagination)
  }

  useEffect(() => {
    fetchOrders()
  }, [page, paymentFilter, statusFilter])

  /* reset page when filter/search */
  useEffect(() => {
    setPage(1)
  }, [paymentFilter, statusFilter, keyword])

  /* ================== ACTION ================== */

  const saveStatus = async (orderId) => {
    await updateOrderStatus(orderId, nextStatus)
    setEditingId(null)
    fetchOrders()
  }

  const getPageNumbers = () => {
    const total = pagination.totalPages
    const current = page
    const delta = 2 // số trang trước & sau

    const pages = []

    const left = Math.max(2, current - delta)
    const right = Math.min(total - 1, current + delta)

    pages.push(1)

    if (left > 2) pages.push("...")

    for (let i = left; i <= right; i++) {
      pages.push(i)
    }

    if (right < total - 1) pages.push("...")

    if (total > 1) pages.push(total)

    return pages
  }


  /* ================== RENDER ================== */

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        {/* HEADER */}
        <h1 className="text-2xl font-bold mb-6">Quản lý đơn hàng</h1>

        {/* SEARCH + FILTER */}
        <div className="bg-white p-3 rounded shadow flex flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2 flex-1">
            <Search size={18} />
            <input
              className="flex-1 outline-none"
              placeholder="Tìm mã đơn, khách hàng..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <select
            className="border rounded px-3 py-1"
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            <option value="">Tất cả thanh toán</option>
            <option value="COD">COD</option>
            <option value="VNPAY">VNPAY</option>
          </select>

          <select
            className="border rounded px-3 py-1"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            {Object.keys(STATUS_LABEL).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Mã đơn</th>
                <th className="p-3">Khách hàng</th>
                <th className="p-3">Tổng tiền</th>
                <th className="p-3">Thanh toán</th>
                <th className="p-3">Ngày đặt</th>
                <th className="p-3">Trạng thái</th>
                <th className="p-3">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o, i) => (
                <tr key={o.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    {(page - 1) * PAGE_SIZE + i + 1}
                  </td>
                  <td className="p-3 font-medium">#{o.id}</td>
                  <td className="p-3">{o.customerName}</td>
                  <td className="p-3">
                    {Number(o.price).toLocaleString("vi-VN")} ₫
                  </td>
                  <td className="p-3">{o.payment_method}</td>
                  <td className="p-3">{formatDateTime(o.order_date)}</td>

                  {/* STATUS */}
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded ${STATUS_COLOR[o.status]}`}
                    >
                      {STATUS_LABEL[o.status]}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td className="p-3">
                    {editingId === o.id ? (
                      <div className="flex items-center gap-2">
                        <select
                          className="border rounded px-2 py-1 text-xs"
                          value={nextStatus}
                          onChange={(e) => setNextStatus(e.target.value)}
                        >
                          {STATUS_FLOW[o.status].map((s) => (
                            <option key={s} value={s}>
                              {STATUS_LABEL[s]}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={() => saveStatus(o.id)}
                          className="text-green-600"
                        >
                          <Check size={16} />
                        </button>

                        <button
                          onClick={() => setEditingId(null)}
                          className="text-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <button className="hover:text-blue-600">
                          <Eye size={18} />
                        </button>

                        {STATUS_FLOW[o.status].length > 0 && (
                          <button
                            onClick={() => {
                              setEditingId(o.id)
                              setNextStatus(STATUS_FLOW[o.status][0])
                            }}
                            className="hover:text-orange-600"
                          >
                            <Pencil size={16} />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {orders.length === 0 && (
                <tr>
                  <td colSpan="8" className="p-4 text-center text-gray-500">
                    Không có đơn hàng
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* PAGINATION */}
          <div className="flex justify-between items-center p-4 border-t">
            <span className="text-sm text-gray-600">
              Trang {pagination.page} / {pagination.totalPages} — Tổng{" "}
              {pagination.total} đơn
            </span>

            <div className="flex items-center gap-1">
              {/* PREV */}
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                «
              </button>

              {/* PAGE NUMBERS */}
              {getPageNumbers().map((p, i) =>
                p === "..." ? (
                  <span key={i} className="px-2 text-gray-500">
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-1 border rounded
            ${p === page
                        ? "bg-blue-600 text-white border-blue-600"
                        : "hover:bg-gray-100"
                      }
          `}
                  >
                    {p}
                  </button>
                )
              )}

              {/* NEXT */}
              <button
                disabled={page === pagination.totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                »
              </button>
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  )
}

export default OrderManagement
