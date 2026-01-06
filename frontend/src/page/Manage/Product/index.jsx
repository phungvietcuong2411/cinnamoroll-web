import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import AdminLayout from "../../../layouts/AdminLayout"
import { Search, ArrowUpDown, Plus } from "lucide-react"
import { getAllProducts } from "../../../services/product.service"


function ProductManagement() {
    const [products, setProducts] = useState([])
    const [keyword, setKeyword] = useState("")
    const [sortField, setSortField] = useState(null)
    const [sortOrder, setSortOrder] = useState("asc")

    /* ===================== FETCH DATA ===================== */
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await getAllProducts()
                setProducts(res.data) // nếu backend trả { data: [] } → res.data.data
            } catch (error) {
                console.error("Lỗi lấy sản phẩm:", error)
            }
        }

        fetchProducts()
    }, [])

    /* ===================== SORT ===================== */
    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortOrder("asc")
        }
    }

    /* ===================== FILTER + SORT ===================== */
    const filteredProducts = products
        .filter((p) =>
            p.name.toLowerCase().includes(keyword.toLowerCase())
        )
        .sort((a, b) => {
            if (!sortField) return 0

            let valA = a[sortField]
            let valB = b[sortField]

            // ÉP KIỂU CHO GIÁ
            if (sortField === "price" || sortField === "quantity" || sortField === "saleCount") {
                valA = Number(valA)
                valB = Number(valB)
            }

            // STRING
            if (typeof valA === "string") {
                valA = valA.toLowerCase()
                valB = valB.toLowerCase()
            }

            if (valA < valB) return sortOrder === "asc" ? -1 : 1
            if (valA > valB) return sortOrder === "asc" ? 1 : -1
            return 0
        })


    /* ===================== UI ===================== */
    return (
        <AdminLayout>
            <div className="p-6 bg-gray-100 min-h-screen font-futura-regular">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
                        <p className="text-gray-600">
                            Danh sách toàn bộ sản phẩm trong hệ thống
                        </p>
                    </div>

                    {/* ADD BUTTON */}
                    <Link
                        to="/manage/products/create"
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        <Plus size={18} />
                        Thêm sản phẩm
                    </Link>
                </div>


                {/* Search */}
                <div className="mb-4 flex items-center gap-2 bg-white p-3 rounded shadow">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Tìm theo tên sản phẩm..."
                        className="flex-1 outline-none"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>

                {/* Table */}
                <div className="bg-white rounded shadow overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-200 text-left">
                            <tr>
                                <th className="p-3 w-12">#</th>
                                <th className="p-3 w-16">Ảnh</th>

                                <th
                                    className="p-3 cursor-pointer hover:text-blue-600"
                                    onClick={() => handleSort("name")}
                                >
                                    <div className="flex items-center gap-1">
                                        Tên sản phẩm <ArrowUpDown size={14} />
                                    </div>
                                </th>

                                <th
                                    className="p-3 cursor-pointer hover:text-blue-600"
                                    onClick={() => handleSort("price")}
                                >
                                    <div className="flex items-center gap-1">
                                        Giá <ArrowUpDown size={14} />
                                    </div>
                                </th>

                                <th
                                    className="p-3 cursor-pointer hover:text-blue-600"
                                    onClick={() => handleSort("quantity")}
                                >
                                    <div className="flex items-center gap-1">
                                        Tồn kho <ArrowUpDown size={14} />
                                    </div>
                                </th>

                                <th
                                    className="p-3 cursor-pointer hover:text-blue-600"
                                    onClick={() => handleSort("saleCount")}
                                >
                                    <div className="flex items-center gap-1">
                                        Đã bán <ArrowUpDown size={14} />
                                    </div>
                                </th>

                                <th className="p-3">Loại</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredProducts.map((product, index) => (
                                <tr
                                    key={product.id}
                                    className="border-t hover:bg-gray-50"
                                >
                                    <td className="p-3">{index + 1}</td>

                                    <td className="p-3">
                                        <img
                                            src={product.imgMain}
                                            alt={product.name}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                    </td>

                                    {/* NAME → DETAIL */}
                                    <td className="p-3 font-medium">
                                        <Link
                                            to={`/manage/products/${product.id}`}
                                            className="hover:underline text-black"
                                        >
                                            {product.name}
                                        </Link>
                                    </td>

                                    <td className="p-3">
                                        {Number(product.price).toLocaleString("vi-VN")} ₫
                                    </td>

                                    <td className="p-3">
                                        {product.quantity === 0 ? (
                                            <span className="text-red-600 font-semibold">
                                                Hết hàng
                                            </span>
                                        ) : (
                                            product.quantity
                                        )}
                                    </td>

                                    <td className="p-3">{product.saleCount}</td>

                                    <td className="p-3">{product.nameType}</td>
                                </tr>
                            ))}

                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="p-4 text-center text-gray-500"
                                    >
                                        Không có sản phẩm
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    )
}

export default ProductManagement
