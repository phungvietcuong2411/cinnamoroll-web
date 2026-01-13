import { useEffect, useState } from "react"
import { Search, Plus, Pencil, Trash2, X } from "lucide-react"
import {
  getAllTypes,
  createType,
  updateType,
  deleteType
} from "../../../services/type.service"
import { useToast } from "../../../components/Notification"  // Điều chỉnh đường dẫn nếu cần

function TypeManagement() {
  const { addToast } = useToast()

  const [types, setTypes] = useState([])
  const [keyword, setKeyword] = useState("")
  const [sortOrder, setSortOrder] = useState("asc")

  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingType, setEditingType] = useState(null)
  const [deletingType, setDeletingType] = useState(null)
  const [nameType, setNameType] = useState("")
  const [loading, setLoading] = useState(false)

  // ================= FETCH =================
  useEffect(() => {
    fetchTypes()
  }, [])

  const fetchTypes = async () => {
    try {
      const res = await getAllTypes()
      setTypes(res.data)
    } catch (err) {
      console.error("Lỗi lấy loại sản phẩm", err)
      addToast("Không thể tải danh sách loại sản phẩm", "error")
    }
  }

  // ================= FILTER + SORT =================
  const filteredTypes = types
    .filter(t =>
      String(t?.nameType || "")
        .toLowerCase()
        .includes(keyword.toLowerCase())
    )
    .sort((a, b) => {
      const nameA = a?.nameType || ""
      const nameB = b?.nameType || ""

      if (nameA < nameB) return sortOrder === "asc" ? -1 : 1
      if (nameA > nameB) return sortOrder === "asc" ? 1 : -1
      return 0
    })

  const toggleSort = () => {
    setSortOrder(prev => (prev === "asc" ? "desc" : "asc"))
  }

  // ================= CRUD =================
  const openCreateModal = () => {
    setEditingType(null)
    setNameType("")
    setShowModal(true)
  }

  const openEditModal = (type) => {
    setEditingType(type)
    setNameType(type.nameType)
    setShowModal(true)
  }

  const openDeleteModal = (type) => {
    setDeletingType(type)
    setShowDeleteModal(true)
  }

  const handleSave = async () => {
    if (!nameType.trim()) {
      addToast("Tên loại sản phẩm không được để trống", "warning")
      return
    }

    try {
      setLoading(true)

      if (editingType) {
        await updateType(editingType.id, { nameType })
        addToast("Cập nhật loại sản phẩm thành công!", "success")
      } else {
        await createType({ nameType })
        addToast("Thêm loại sản phẩm thành công!", "success")
      }

      await fetchTypes()
      setShowModal(false)
    } catch (err) {
      console.error(err)
      addToast("Thao tác thất bại. Vui lòng thử lại.", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingType) return

    try {
      await deleteType(deletingType.id)
      setTypes(prev => prev.filter(t => t.id !== deletingType.id))
      addToast("Xoá loại sản phẩm thành công!", "success")
    } catch (err) {
      console.error(err)
      addToast("Xoá thất bại. Có thể loại này đang được sử dụng.", "error")
    } finally {
      setShowDeleteModal(false)
      setDeletingType(null)
    }
  }

  // ================= RENDER =================
  return (
    <>
      <div className="p-6 bg-gray-100 min-h-screen font-futura-regular">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Loại sản phẩm</h1>
          <p className="text-gray-600">Quản lý danh mục loại sản phẩm</p>
        </div>

        {/* Search + Add */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow flex-1">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Tìm theo tên loại sản phẩm..."
              className="flex-1 outline-none"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg shadow hover:bg-blue-700 transition"
          >
            <Plus size={18} />
            Thêm loại
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-4 w-16 font-medium">#</th>
                <th
                  className="p-4 font-medium cursor-pointer hover:text-blue-600 flex items-center gap-1"
                  onClick={toggleSort}
                >
                  Tên loại sản phẩm
                  <span className="text-xs">{sortOrder === "asc" ? "↑" : "↓"}</span>
                </th>
                <th className="p-4 w-32 text-center font-medium">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {filteredTypes.map((type, index) => (
                <tr key={type.id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">{type.nameType}</td>
                  <td className="p-4 flex justify-center gap-4">
                    <button
                      onClick={() => openEditModal(type)}
                      className="text-blue-600 hover:text-blue-800 transition"
                      title="Sửa"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(type)}
                      className="text-red-600 hover:text-red-800 transition"
                      title="Xoá"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredTypes.length === 0 && (
                <tr>
                  <td colSpan="3" className="p-12 text-center text-gray-500">
                    Không tìm thấy loại sản phẩm nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm/Sửa */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 font-futura-regular">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={22} />
            </button>

            <h2 className="text-2xl font-bold mb-6">
              {editingType ? "Sửa loại sản phẩm" : "Thêm loại sản phẩm mới"}
            </h2>

            <input
              type="text"
              value={nameType}
              onChange={(e) => setNameType(e.target.value)}
              placeholder="Nhập tên loại sản phẩm"
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
              autoFocus
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-70 transition"
              >
                {loading ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xác nhận Xóa */}
      {showDeleteModal && deletingType && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 font-futura-regular">
          <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl p-6">
            <h3 className="text-xl font-bold mb-4 text-red-600">Xác nhận xoá</h3>
            <p className="text-gray-700 mb-6">
              Bạn có chắc chắn muốn xoá loại sản phẩm <strong>"{deletingType.nameType}"</strong>?<br />
              <span className="text-sm text-red-500">Hành động này không thể hoàn tác.</span>
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeletingType(null)
                }}
                className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 transition"
              >
                Xoá
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TypeManagement