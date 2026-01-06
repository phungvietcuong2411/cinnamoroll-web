import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import AdminLayout from "../../../../layouts/AdminLayout"
import { createProduct } from "../../../../services/product.service"
import { getAllTypes } from "../../../../services/type.service"
import { createType } from "../../../../services/type.service" // Giả sử bạn import từ đây
import { Save, ArrowLeft, X, Upload, Image as ImageIcon, Loader2, Plus } from "lucide-react"

function CreateProduct() {
    const navigate = useNavigate()

    const [types, setTypes] = useState([])
    const [typesLoading, setTypesLoading] = useState(false)
    const [typesError, setTypesError] = useState("")

    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        name: "",
        price: "",
        quantity: "",
        idType: ""
    })

    // Modal cho chọn loại
    const [showTypeModal, setShowTypeModal] = useState(false)
    const [newTypeName, setNewTypeName] = useState("")
    const [creatingType, setCreatingType] = useState(false)

    // File local
    const [imgMain, setImgMain] = useState(null)
    const [imgMainPreview, setImgMainPreview] = useState(null)

    const [images, setImages] = useState([])
    const [imagePreviews, setImagePreviews] = useState([])

    /* ===================== LOAD TYPES ===================== */
    useEffect(() => {
        const fetchTypes = async () => {
            setTypesLoading(true)
            try {
                const res = await getAllTypes()
                setTypes(Array.isArray(res.data) ? res.data : res.data?.data || [])
            } catch (err) {
                console.error(err)
                setTypesError("Không thể tải danh sách loại sản phẩm")
            } finally {
                setTypesLoading(false)
            }
        }
        fetchTypes()
    }, [])

    /* ===================== CREATE NEW TYPE ===================== */
    const handleCreateType = async () => {
        if (!newTypeName.trim()) {
            alert("Vui lòng nhập tên loại mới!")
            return
        }
        setCreatingType(true)
        try {
            await createType({ nameType: newTypeName.trim() })
            alert("✅ Thêm loại sản phẩm thành công!")
            // Reload types
            const res = await getAllTypes()
            setTypes(Array.isArray(res.data) ? res.data : res.data?.data || [])
            // Chọn loại mới vừa tạo (giả sử backend trả id)
            const newType = res.data.find(t => t.nameType === newTypeName.trim())
            if (newType) setForm(prev => ({ ...prev, idType: newType.id }))
            setNewTypeName("")
        } catch (err) {
            console.error(err)
            alert("❌ Thêm loại thất bại: " + (err.response?.data?.message || err.message))
        } finally {
            setCreatingType(false)
        }
    }

    /* ===================== INPUT ===================== */
    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    /* ===================== IMG MAIN ===================== */
    const handleImgMain = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        setImgMain(file)
        setImgMainPreview(URL.createObjectURL(file))
    }

    const removeMainImage = () => {
        setImgMain(null)
        setImgMainPreview(null)
    }

    /* ===================== IMAGES PHỤ ===================== */
    const handleImages = (e) => {
        const files = Array.from(e.target.files || [])
        setImages(prev => [...prev, ...files])
        setImagePreviews(prev => [
            ...prev,
            ...files.map(file => URL.createObjectURL(file))
        ])
    }

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index))
        setImagePreviews(prev => prev.filter((_, i) => i !== index))
    }

    /* ===================== SUBMIT ===================== */
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.name || !form.price || !form.idType || !imgMain) {
            alert("Vui lòng nhập đủ: tên, giá, loại và ảnh chính!")
            return
        }
        const formData = new FormData()
        formData.append("name", form.name)
        formData.append("price", form.price)
        formData.append("quantity", form.quantity || 0)
        formData.append("idType", form.idType)
        formData.append("imgMain", imgMain)
        images.forEach(file => formData.append("images", file))

        // Debug
        console.log("===== FORM DATA SEND =====")
        for (let [key, value] of formData.entries()) {
            console.log(key, value)
        }

        try {
            setLoading(true)
            await createProduct(formData)
            alert("✅ Thêm sản phẩm thành công!")
            navigate("/manage/products")
        } catch (err) {
            console.error("CREATE PRODUCT ERROR:", err.response?.data || err)
            alert("❌ Thêm sản phẩm thất bại!")
        } finally {
            setLoading(false)
        }
    }

    return (
        <AdminLayout>
            <div className="p-6 bg-gray-50 min-h-screen font-futura-regular">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Thêm sản phẩm mới</h1>
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                        <ArrowLeft size={20} /> Quay lại
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="grid lg:grid-cols-2 gap-8 p-8">
                        {/* LEFT: FORM INFO */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">Thông tin sản phẩm</h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tên sản phẩm <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Nhập tên sản phẩm"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Giá bán <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={form.price}
                                        onChange={handleChange}
                                        placeholder="0"
                                        min="0"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Số lượng
                                    </label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={form.quantity}
                                        onChange={handleChange}
                                        placeholder="0"
                                        min="0"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Loại sản phẩm - Trigger modal */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Loại sản phẩm <span className="text-red-500">*</span>
                                </label>
                                <div
                                    onClick={() => setShowTypeModal(true)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white cursor-pointer hover:border-blue-500 transition flex justify-between items-center"
                                >
                                    {form.idType
                                        ? types.find(t => t.id === form.idType)?.nameType || "Đã chọn"
                                        : "-- Chọn loại --"}
                                    <span className="text-gray-400">▼</span>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: IMAGES */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">Hình ảnh sản phẩm</h2>

                            {/* Ảnh chính */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh chính <span className="text-red-500">*</span></label>
                                {!imgMainPreview ? (
                                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 bg-gray-50">
                                        <Upload size={48} className="text-gray-400 mb-3" />
                                        <p className="text-sm text-gray-600">Nhấp để tải lên</p>
                                        <input type="file" accept="image/*" onChange={handleImgMain} className="hidden" />
                                    </label>
                                ) : (
                                    <div className="relative">
                                        <img src={imgMainPreview} alt="Main" className="w-full h-80 object-cover rounded-xl shadow-md" />
                                        <button type="button" onClick={removeMainImage} className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2">
                                            <X size={18} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Ảnh phụ */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh phụ</label>
                                <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 bg-gray-50">
                                    <ImageIcon size={32} className="text-gray-400 mr-3" />
                                    <p className="text-sm text-gray-600">Thêm ảnh</p>
                                    <input type="file" multiple accept="image/*" onChange={handleImages} className="hidden" />
                                </label>
                                {imagePreviews.length > 0 && (
                                    <div className="grid grid-cols-4 gap-3 mt-4">
                                        {imagePreviews.map((src, i) => (
                                            <div key={i} className="relative">
                                                <img src={src} alt={`Sub ${i}`} className="w-full h-28 object-cover rounded-lg shadow" />
                                                <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1">
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="px-8 py-5 border-t flex justify-end">
                        <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50">
                            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                            {loading ? "Đang lưu..." : "Lưu sản phẩm"}
                        </button>
                    </div>
                </form>

                {/* MODAL CHỌN LOẠI SẢN PHẨM */}
                {showTypeModal && (
                    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
                            <button onClick={() => setShowTypeModal(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
                                <X size={24} />
                            </button>

                            <h3 className="text-xl font-bold mb-4">Chọn loại sản phẩm</h3>

                            {/* Thêm loại mới */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2">Thêm loại mới</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newTypeName}
                                        onChange={e => setNewTypeName(e.target.value)}
                                        placeholder="Nhập tên loại mới"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                                    />
                                    <button
                                        onClick={handleCreateType}
                                        disabled={creatingType}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {creatingType ? <Loader2 className="animate-spin" /> : <Plus size={18} />}
                                        Thêm
                                    </button>
                                </div>
                            </div>

                            {/* Danh sách loại */}
                            <div className="max-h-64 overflow-y-auto border-t pt-4">
                                {typesLoading ? (
                                    <div className="text-center py-4">
                                        <Loader2 className="animate-spin inline-block" /> Đang tải...
                                    </div>
                                ) : typesError ? (
                                    <div className="text-red-600 text-center py-4">{typesError}</div>
                                ) : types.length === 0 ? (
                                    <div className="text-gray-500 text-center py-4">Chưa có loại nào</div>
                                ) : (
                                    types.map(t => (
                                        <div
                                            key={t.id}
                                            onClick={() => {
                                                setForm(prev => ({ ...prev, idType: t.id }))
                                                setShowTypeModal(false)
                                            }}
                                            className="px-4 py-3 hover:bg-blue-50 cursor-pointer rounded-lg transition"
                                        >
                                            {t.nameType}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}

export default CreateProduct