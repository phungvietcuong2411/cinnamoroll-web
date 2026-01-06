import { useEffect, useState } from "react"
import AdminLayout from "../../../layouts/AdminLayout"
import { Search } from "lucide-react"
import { getAllUsers } from "../../../services/user.service"

function GuestManagement() {
    const [users, setUsers] = useState([])
    const [keyword, setKeyword] = useState("")
    const [sortField, setSortField] = useState(null)
    const [sortOrder, setSortOrder] = useState("asc")

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortOrder("asc")
        }
    }

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await getAllUsers()
                console.log(res.data)
                setUsers(res.data) // giả sử backend trả về mảng users
            } catch (error) {
                console.error("Lỗi lấy danh sách users:", error)
            }
        }

        fetchUsers()
    }, [])

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("vi-VN", {
            hour12: false
        })
    }

    const filteredUsers = users
        .filter(
            (u) =>
                u.account.toLowerCase().includes(keyword.toLowerCase()) ||
                u.gmail.toLowerCase().includes(keyword.toLowerCase()) ||
                u.phone.includes(keyword)
        )
        .sort((a, b) => {
            if (!sortField) return 0

            let valA = a[sortField]
            let valB = b[sortField]

            if (sortField === "created_at") {
                valA = new Date(valA)
                valB = new Date(valB)
            }

            if (valA < valB) return sortOrder === "asc" ? -1 : 1
            if (valA > valB) return sortOrder === "asc" ? 1 : -1
            return 0
        })


    return (
        <>
            <AdminLayout>
                <div className="flex">
                    <div className="flex-1 p-6 bg-gray-100 min-h-screen font-futura-regular">
                        {/* Header */}
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold">Quản lý khách hàng</h1>
                            <p className="text-gray-600">Danh sách người dùng trong hệ thống</p>
                        </div>

                        {/* Search */}
                        <div className="mb-4 flex items-center gap-2 bg-white p-3 rounded shadow">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Tìm theo tài khoản hoặc email..."
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
                                        <th className="p-3">#</th>

                                        <th
                                            className="p-3 cursor-pointer hover:text-blue-600"
                                            onClick={() => handleSort("account")}
                                        >
                                            Tài khoản
                                        </th>

                                        <th
                                            className="p-3 cursor-pointer hover:text-blue-600"
                                            onClick={() => handleSort("name")}
                                        >
                                            Tên
                                        </th>

                                        <th
                                            className="p-3 cursor-pointer hover:text-blue-600"
                                            onClick={() => handleSort("gmail")}
                                        >
                                            Email
                                        </th>

                                        <th className="p-3">SĐT</th>

                                        <th
                                            className="p-3 cursor-pointer hover:text-blue-600"
                                            onClick={() => handleSort("role")}
                                        >
                                            Quyền
                                        </th>

                                        <th
                                            className="p-3 cursor-pointer hover:text-blue-600"
                                            onClick={() => handleSort("created_at")}
                                        >
                                            Ngày tạo
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user, index) => (
                                        <tr key={user.id} className="border-t hover:bg-gray-50">
                                            <td className="p-3">{index + 1}</td>
                                            <td className="p-3">{user.account}</td>
                                            <td className="p-3">{user.name}</td>
                                            <td className="p-3">{user.gmail}</td>
                                            <td className="p-3">{user.phone}</td>
                                            <td className="p-3">
                                                <span
                                                    className={`px-2 py-1 rounded text-xs ${user.role === "admin"
                                                        ? "bg-red-100 text-red-600"
                                                        : "bg-blue-100 text-blue-600"
                                                        }`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                {formatDate(user.created_at)}
                                            </td>

                                        </tr>
                                    ))}

                                    {filteredUsers.length === 0 && (
                                        <tr>
                                            <td colSpan="7" className="p-4 text-center text-gray-500">
                                                Không tìm thấy khách hàng
                                            </td>
                                        </tr>
                                    )}
                                </tbody>

                            </table>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </>
    )
}

export default GuestManagement
