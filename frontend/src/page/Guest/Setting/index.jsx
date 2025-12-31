import { useEffect, useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { jwtDecode } from "jwt-decode"
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import {
  getUserById,
  updateUser,
  changePassword
} from "../../../services/user.service"

function FormMessage({ message }) {
  if (!message) return null

  const isSuccess = message.type === "success"

  return (
    <div
      className={`mb-6 p-4 text-sm border rounded-lg font-medium ${
        isSuccess
          ? "bg-green-50 text-green-700 border-green-300"
          : "bg-red-50 text-red-700 border-red-300"
      }`}
    >
      {message.text}
    </div>
  )
}

function Settings() {
  const [activeTab, setActiveTab] = useState("profile")
  const [loading, setLoading] = useState(false)

  const token = localStorage.getItem("token")
  const decoded = token ? jwtDecode(token) : null
  const userId = decoded?.id

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  })

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: ""
  })

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const [profileMessage, setProfileMessage] = useState(null)
  const [passwordMessage, setPasswordMessage] = useState(null)

  useEffect(() => {
    if (!userId) {
      setProfileMessage({ type: "error", text: "Phiên đăng nhập không hợp lệ" })
      return
    }

    const fetchUser = async () => {
      try {
        setLoading(true)
        const res = await getUserById(userId)
        setProfile({
          name: res.data.name || "",
          email: res.data.gmail || "",
          phone: res.data.phone || "",
          address: res.data.address || ""
        })
      } catch (err) {
        setProfileMessage({ type: "error", text: "Không thể tải thông tin người dùng" })
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userId])

  const handleProfileChange = (e) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handlePasswordChange = (e) => {
    setPassword(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const togglePassword = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const saveProfile = async (e) => {
    e.preventDefault()
    setProfileMessage(null)

    try {
      setLoading(true)
      await updateUser(userId, {
        name: profile.name,
        gmail: profile.email,
        phone: profile.phone,
        address: profile.address
      })
      setProfileMessage({ type: "success", text: "Cập nhật thông tin thành công!" })
    } catch (err) {
      setProfileMessage({ type: "error", text: "Cập nhật thông tin thất bại. Vui lòng thử lại." })
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPasswordMessage(null)

    if (!password.current || !password.new || !password.confirm) {
      setPasswordMessage({ type: "error", text: "Vui lòng nhập đầy đủ các trường." })
      return
    }

    if (password.new !== password.confirm) {
      setPasswordMessage({ type: "error", text: "Mật khẩu mới và xác nhận không khớp." })
      return
    }

    if (password.new.length < 6) {
      setPasswordMessage({ type: "error", text: "Mật khẩu mới phải có ít nhất 6 ký tự." })
      return
    }

    try {
      setLoading(true)
      await changePassword({
        oldPassword: password.current,
        newPassword: password.new,
        confirmPassword: password.confirm
      })

      setPasswordMessage({ type: "success", text: "Đổi mật khẩu thành công!" })
      setPassword({ current: "", new: "", confirm: "" })
      setShowPassword({ current: false, new: false, confirm: false })
    } catch (err) {
      setPasswordMessage({
        type: "error",
        text: err.response?.data?.message || "Đổi mật khẩu thất bại. Vui lòng thử lại."
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <div className="h-16" />

      <div className="px-4 md:px-36 py-10 font-futura-regular min-h-screen">
        <h1 className="font-frankfurter text-3xl md:text-5xl mb-10 text-center">
          CÀI ĐẶT TÀI KHOẢN
        </h1>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Menu trái */}
          <aside className="md:w-64 border rounded-lg overflow-hidden">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full text-left px-6 py-4 transition ${
                activeTab === "profile"
                  ? "bg-black text-white font-semibold"
                  : "hover:bg-gray-100"
              }`}
            >
              Thông tin cá nhân
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`w-full text-left px-6 py-4 transition ${
                activeTab === "password"
                  ? "bg-black text-white font-semibold"
                  : "hover:bg-gray-100"
              }`}
            >
              Đổi mật khẩu
            </button>
          </aside>

          {/* Nội dung chính */}
          <section className="flex-1 border rounded-lg p-6 md:p-8">
            {loading && (
              <p className="text-sm text-gray-500 mb-6">Đang xử lý...</p>
            )}

            {activeTab === "profile" && (
              <form onSubmit={saveProfile} className="max-w-2xl">
                <h2 className="font-frankfurter text-2xl mb-6">
                  Thông tin cá nhân
                </h2>

                <FormMessage message={profileMessage} />

                <div className="space-y-5">
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    placeholder="Họ và tên"
                    className="w-full border border-gray-300 rounded-lg p-4 outline-none focus:border-black transition"
                  />
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    placeholder="Email"
                    className="w-full border border-gray-300 rounded-lg p-4 outline-none focus:border-black transition"
                  />
                  <input
                    type="text"
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    placeholder="Số điện thoại"
                    className="w-full border border-gray-300 rounded-lg p-4 outline-none focus:border-black transition"
                  />
                  <input
                    type="text"
                    name="address"
                    value={profile.address}
                    onChange={handleProfileChange}
                    placeholder="Địa chỉ"
                    className="w-full border border-gray-300 rounded-lg p-4 outline-none focus:border-black transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-8 bg-black text-white py-4 px-12 font-frankfurter rounded-lg hover:opacity-90 disabled:opacity-60 transition"
                >
                  Lưu thay đổi
                </button>
              </form>
            )}

            {activeTab === "password" && (
              <form onSubmit={handleChangePassword} className="max-w-2xl">
                <h2 className="font-frankfurter text-2xl mb-6">
                  Đổi mật khẩu
                </h2>

                <FormMessage message={passwordMessage} />

                <div className="space-y-5">
                  {[
                    { field: "current", placeholder: "Mật khẩu hiện tại" },
                    { field: "new", placeholder: "Mật khẩu mới" },
                    { field: "confirm", placeholder: "Xác nhận mật khẩu mới" }
                  ].map(({ field, placeholder }) => (
                    <div key={field} className="relative">
                      <input
                        type={showPassword[field] ? "text" : "password"}
                        name={field}
                        value={password[field]}
                        onChange={handlePasswordChange}
                        placeholder={placeholder}
                        className="w-full border border-gray-300 rounded-lg p-4 pr-12 outline-none focus:border-black transition"
                      />
                      <button
                        type="button"
                        onClick={() => togglePassword(field)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword[field] ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-8 bg-black text-white py-4 px-12 font-frankfurter rounded-lg hover:opacity-90 disabled:opacity-60 transition"
                >
                  Cập nhật mật khẩu
                </button>
              </form>
            )}
          </section>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default Settings