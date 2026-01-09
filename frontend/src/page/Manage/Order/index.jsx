import { useEffect, useState } from "react"
import AdminLayout from "../../../layouts/AdminLayout"
import {
  Search,
  Eye,
  Pencil,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react"
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
  const [loading, setLoading] = useState(false)

  /* search & filter */
  const [keyword, setKeyword] = useState("")
  const [paymentFilter, setPaymentFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  /* pagination */
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalOrders, setTotalOrders] = useState(0)

  /* edit status */
  const [editingId, setEditingId] = useState(null)
  const [nextStatus, setNextStatus] = useState("")

  /* ================== FETCH ================== */

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await getAllOrders({
        page,
        limit: PAGE_SIZE,
        paymentMethod: paymentFilter || undefined,
        status: statusFilter || undefined,
        keyword: keyword || undefined,
      })

      setOrders(res.data.data || [])
      setTotalPages(res.data.pagination?.totalPages || 1)
      setTotalOrders(res.data.pagination?.total || 0)
    } catch (error) {
      console.error("Lỗi tải đơn hàng:", error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [page, paymentFilter, statusFilter, keyword]) // Gọi lại khi bất kỳ filter nào thay đổi

  /* ================== ACTION ================== */

  const saveStatus = async (orderId) => {
    try {
      await updateOrderStatus(orderId, nextStatus)
      fetchOrders() // Refresh dữ liệu
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error)
    } finally {
      setEditingId(null)
    }
  }

  /* ================== RENDER ================== */

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-100 min-h-screen font-futura-regular">
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Quản lý đơn hàng</h1>
          <p className="text-gray-600">
            Danh sách toàn bộ đơn hàng trong hệ thống
          </p>
        </div>

        {/* SEARCH + FILTER */}
        <div className="mb-4 flex flex-wrap gap-3 bg-white p-3 rounded shadow">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <Search size={18} />
            <input
              type="text"
              placeholder="Tìm mã đơn, khách hàng..."
              className="flex-1 outline-none"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <select
            className="border border-gray-300 rounded px-3 py-2 text-sm"
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            <option value="">Tất cả thanh toán</option>
            <option value="COD">COD</option>
            <option value="VNPAY">VNPAY</option>
          </select>

          <select
            className="border border-gray-300 rounded px-3 py-2 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            {Object.entries(STATUS_LABEL).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-200 text-left">
              <tr>
                <th className="p-3 w-12">#</th>
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
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-6 text-center">
                    <div className="flex justify-center items-center gap-2 text-gray-500">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                      <span>Đang tải dữ liệu...</span>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-4 text-center text-gray-500">
                    Không có đơn hàng
                  </td>
                </tr>
              ) : (
                orders.map((o, i) => (
                  <tr key={o.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      {(page - 1) * PAGE_SIZE + i + 1}
                    </td>
                    <td className="p-3 font-medium">#{o.id}</td>
                    <td className="p-3">{o.customerName || "Khách lẻ"}</td>
                    <td className="p-3">
                      {Number(o.price).toLocaleString("vi-VN")} ₫
                    </td>
                    <td className="p-3">{o.payment_method || "-"}</td>
                    <td className="p-3">{formatDateTime(o.order_date)}</td>

                    {/* STATUS */}
                    <td className="p-3">
                      {editingId === o.id ? (
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
                      ) : (
                        <span
                          className={`px-2 py-1 text-xs rounded ${STATUS_COLOR[o.status]}`}
                        >
                          {STATUS_LABEL[o.status]}
                        </span>
                      )}
                    </td>

                    {/* ACTION */}
                    <td className="p-3">
                      {editingId === o.id ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => saveStatus(o.id)}
                            className="text-green-600 hover:text-green-800"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-red-600 hover:text-red-800"
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
                ))
              )}
            </tbody>
          </table>

          {/* PAGINATION - GIỐNG TRANG QUẢN LÝ SẢN PHẨM */}
          {totalPages > 1 && (
            <div className="flex justify-end items-center gap-4 py-8 px-2 border-t">
              <nav className="flex items-center gap-2">
                {/* Nút Trước */}
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || loading}
                  className="w-9 h-9 flex items-center justify-center border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={18} />
                </button>

                {/* Các số trang - hiển thị thông minh */}
                {(() => {
                  const pages = []
                  const maxVisible = 5
                  let start = Math.max(1, page - Math.floor(maxVisible / 2))
                  let end = Math.min(totalPages, start + maxVisible - 1)

                  if (end - start + 1 < maxVisible) {
                    start = Math.max(1, end - maxVisible + 1)
                  }

                  // Trang 1
                  if (start > 1) {
                    pages.push(
                      <button
                        key={1}
                        onClick={() => setPage(1)}
                        className="w-9 h-9 border border-gray-300 text-sm font-medium hover:bg-gray-50 transition-all"
                      >
                        1
                      </button>
                    )
                    if (start > 2) {
                      pages.push(
                        <span key="start-dots" className="text-gray-400 px-1">
                          ...
                        </span>
                      )
                    }
                  }

                  // Các trang giữa
                  for (let i = start; i <= end; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => setPage(i)}
                        className={`w-9 h-9 text-sm font-medium transition-all ${
                          page === i
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        {i}
                      </button>
                    )
                  }

                  // Trang cuối
                  if (end < totalPages) {
                    if (end < totalPages - 1) {
                      pages.push(
                        <span key="end-dots" className="text-gray-400 px-1">
                          ...
                        </span>
                      )
                    }
                    pages.push(
                      <button
                        key={totalPages}
                        onClick={() => setPage(totalPages)}
                        className="w-9 h-9 border border-gray-300 text-sm font-medium hover:bg-gray-50 transition-all"
                      >
                        {totalPages}
                      </button>
                    )
                  }

                  return pages
                })()}

                {/* Nút Sau */}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || loading}
                  className="w-9 h-9 flex items-center justify-center border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={18} />
                </button>

                {/* Ô nhập trang */}
                <div className="flex items-center gap-2 ml-3 text-sm">
                  <span className="text-gray-500 hidden sm:inline">Đi tới</span>
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={page}
                    onChange={(e) => {
                      const val = e.target.value
                      if (val === "") return
                      const num = parseInt(val, 10)
                      if (!isNaN(num) && num >= 1 && num <= totalPages) {
                        setPage(num)
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const val = parseInt(e.target.value, 10)
                        if (val >= 1 && val <= totalPages) {
                          setPage(val)
                        }
                      }
                    }}
                    className="w-16 px-2 py-1.5 text-center border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:hidden [&::-webkit-inner-spin-button]:hidden"
                  />
                  <span className="text-gray-500">/ {totalPages}</span>
                </div>
              </nav>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default OrderManagement