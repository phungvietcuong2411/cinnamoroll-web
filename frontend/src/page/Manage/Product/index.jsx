import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Search, ArrowUpDown, Plus, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { getAllProducts } from "../../../services/product.service"


function ProductManagement() {
    const [products, setProducts] = useState([])
    const [keyword, setKeyword] = useState("")
    const [sortField, setSortField] = useState(null)
    const [sortOrder, setSortOrder] = useState("asc")
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(false)
    const LIMIT = 10

    /* ===================== FETCH DATA ===================== */
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true)
                setProducts([])

                const res = await getAllProducts({
                    page,
                    limit: LIMIT
                })

                setProducts(res.data.products || [])
                setTotalPages(res.data.pagination?.totalPages || 1)
            } catch (error) {
                console.error("Lỗi lấy sản phẩm:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [page])


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
                            {loading && (
                                <tr>
                                    <td colSpan="7" className="p-6 text-center">
                                        <div className="flex justify-center items-center gap-2 text-gray-500">
                                            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                                            <span>Đang tải dữ liệu...</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {!loading && filteredProducts.map((product, index) => (
                                <tr
                                    key={product.id}
                                    className="border-t hover:bg-gray-50"
                                >
                                    <td className="p-3">
                                        {(page - 1) * LIMIT + index + 1}
                                    </td>

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

                            {!loading && filteredProducts.length === 0 && (
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
                    {totalPages > 1 && (
                        <div className="flex justify-end items-center gap-4 py-8 px-2 border-t ">
                            <nav className="flex items-center gap-2">

                                {/* Nút Trước (<) */}
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="w-9 h-9 flex items-center justify-center border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    aria-label="Trang trước"
                                >
                                    <ChevronLeft size={18} />
                                </button>

                                {/* Các số trang - hiển thị thông minh */}
                                {(() => {
                                    const pages = [];
                                    const maxVisible = 5; // Số nút trang tối đa hiển thị
                                    let start = Math.max(1, page - Math.floor(maxVisible / 2));
                                    let end = Math.min(totalPages, start + maxVisible - 1);

                                    // Điều chỉnh để luôn có đủ số lượng nút
                                    if (end - start + 1 < maxVisible) {
                                        start = Math.max(1, end - maxVisible + 1);
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
                                        );
                                        if (start > 2) {
                                            pages.push(<span key="start-dots" className="text-gray-400 px-1">...</span>);
                                        }
                                    }

                                    // Các trang giữa
                                    for (let i = start; i <= end; i++) {
                                        pages.push(
                                            <button
                                                key={i}
                                                onClick={() => setPage(i)}
                                                className={`w-9 h-9 text-sm font-medium transition-all ${page === i
                                                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                                    : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                                                    }`}
                                            >
                                                {i}
                                            </button>
                                        );
                                    }

                                    // Trang cuối
                                    if (end < totalPages) {
                                        if (end < totalPages - 1) {
                                            pages.push(<span key="end-dots" className="text-gray-400 px-1">...</span>);
                                        }
                                        pages.push(
                                            <button
                                                key={totalPages}
                                                onClick={() => setPage(totalPages)}
                                                className="w-9 h-9 border border-gray-300 text-sm font-medium hover:bg-gray-50 transition-all"
                                            >
                                                {totalPages}
                                            </button>
                                        );
                                    }

                                    return pages;
                                })()}

                                {/* Nút Sau (>) */}
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="w-9 h-9 flex items-center justify-center border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    aria-label="Trang sau"
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
                                            const val = e.target.value;
                                            if (val === "") return;
                                            const num = parseInt(val, 10);
                                            if (!isNaN(num) && num >= 1 && num <= totalPages) {
                                                setPage(num);
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                const val = parseInt(e.target.value, 10);
                                                if (val >= 1 && val <= totalPages) {
                                                    setPage(val);
                                                }
                                            }
                                        }}
                                        className="w-16 px-2 py-1.5 text-center border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:hidden [&::-webkit-inner-spin-button]:hidden"
                                        placeholder={page}
                                    />
                                    <span className="text-gray-500">/ {totalPages}</span>
                                </div>

                            </nav>
                        </div>
                    )}

                </div>
            </div>
    )
}

export default ProductManagement
