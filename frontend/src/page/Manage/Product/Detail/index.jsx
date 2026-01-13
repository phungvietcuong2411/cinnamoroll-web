import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  getProductById,
  getImagesByProduct,
  deleteProduct
} from "../../../../services/product.service"
import { ArrowLeft, Trash2, Pencil } from "lucide-react"

function ProductDetailManagement() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, imageRes] = await Promise.all([
          getProductById(id),
          getImagesByProduct(id)
        ])

        setProduct(productRes.data)
        setImages(imageRes.data || [])
      } catch (error) {
        console.error("Lỗi lấy chi tiết sản phẩm:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return

    try {
      await deleteProduct(id)
      alert("Xóa sản phẩm thành công")
      navigate("/manage/products")
    } catch (error) {
      console.error("Lỗi xóa sản phẩm:", error)
    }
  }

  if (loading) {
    return (
        <div className="p-6">Đang tải dữ liệu...</div>
    )
  }

  if (!product) {
    return (
        <div className="p-6 text-red-500">Không tìm thấy sản phẩm</div>
    )
  }

  return (
      <div className="p-6 bg-gray-100 min-h-screen font-futura-regular">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded hover:bg-gray-200"
            >
              <ArrowLeft />
            </button>
            <h1 className="text-2xl font-bold">Chi tiết sản phẩm</h1>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-3">
            {/* EDIT */}
            <button
              onClick={() => navigate(`/manage/products/${id}/edit`)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Pencil size={18} />
              Chỉnh sửa
            </button>

            {/* DELETE */}
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              <Trash2 size={18} />
              Xóa sản phẩm
            </button>
          </div>
        </div>


        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Images */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-3">Hình ảnh</h2>

            <img
              src={product.imgMain}
              alt={product.name}
              className="w-full h-64 object-cover rounded mb-3"
            />

            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img) => (
                  <img
                    key={img.id}
                    src={img.url}
                    alt=""
                    className="w-full h-20 object-cover rounded border"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="lg:col-span-2 bg-white p-6 rounded shadow space-y-4">
            <div>
              <label className="text-gray-500 text-sm">Tên sản phẩm</label>
              <p className="text-lg font-medium">{product.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-500 text-sm">Giá</label>
                <p className="font-medium text-red-600">
                  {Number(product.price).toLocaleString("vi-VN")} ₫
                </p>
              </div>

              <div>
                <label className="text-gray-500 text-sm">Loại sản phẩm</label>
                <p className="font-medium">{product.nameType}</p>
              </div>

              <div>
                <label className="text-gray-500 text-sm">Số lượng</label>
                <p className="font-medium">{product.quantity}</p>
              </div>

              <div>
                <label className="text-gray-500 text-sm">Đã bán</label>
                <p className="font-medium">{product.saleCount}</p>
              </div>
            </div>

            <div>
              <label className="text-gray-500 text-sm">ID sản phẩm</label>
              <p className="text-sm text-gray-600">{product.id}</p>
            </div>
          </div>
        </div>
      </div>
  )
}

export default ProductDetailManagement
