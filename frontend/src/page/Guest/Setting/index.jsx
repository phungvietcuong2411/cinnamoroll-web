import { useEffect, useState } from "react"
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import { jwtDecode } from "jwt-decode"
import { Eye, EyeOff } from "lucide-react"

import {
  getUserById,
  updateUser,
  changePassword
} from "../../../services/user.service"

/* ================= MESSAGE COMPONENT ================= */
function FormMessage({ message }) {
  if (!message) return null

  const isSuccess = message.type === "success"

  return (
    <div
      className={`mb-4 p-3 text-sm border
        ${isSuccess
          ? "bg-green-50 text-green-700 border-green-300"
          : "bg-red-50 text-red-700 border-red-300"
        }`}
    >
      {message.text}
    </div>
  )
}

function Settings() {
  /* ================= BASIC STATE ================= */
  const [activeTab, setActiveTab] = useState("profile")
  const [loading, setLoading] = useState(false)

  /* ================= TOKEN → USER ================= */
  const token = localStorage.getItem("token")
  const decoded = token ? jwtDecode(token) : null
  const userId = decoded?.id

  /* ================= PROFILE STATE ================= */
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  })

  /* ================= PASSWORD STATE ================= */
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


  /* ================= FORM MESSAGES ================= */
  const [profileMessage, setProfileMessage] = useState(null)
  const [passwordMessage, setPasswordMessage] = useState(null)

  /* ================= FETCH USER ================= */
  useEffect(() => {
    if (!userId) {
      setProfileMessage({
        type: "error",
        text: "Phiên đăng nhập không hợp lệ"
      })
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
        console.error(err)
        setProfileMessage({
          type: "error",
          text: "Không thể tải thông tin người dùng"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userId])

  const handleProfileChange = e => {
    setProfile(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handlePasswordChange = e => {
    setPassword(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const saveProfile = async e => {
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

      setProfileMessage({
        type: "success",
        text: "Cập nhật thông tin thành công"
      })
    } catch (err) {
      console.error(err)
      setProfileMessage({
        type: "error",
        text: "Cập nhật thông tin thất bại"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async e => {
    e.preventDefault()
    setPasswordMessage(null)

    if (!password.current || !password.new || !password.confirm) {
      setPasswordMessage({
        type: "error",
        text: "Vui lòng nhập đầy đủ thông tin"
      })
      return
    }

    if (password.new !== password.confirm) {
      setPasswordMessage({
        type: "error",
        text: "Mật khẩu mới không khớp"
      })
      return
    }

    try {
      setLoading(true)
      await changePassword({
        oldPassword: password.current,
        newPassword: password.new,
        confirmPassword: password.confirm
      })

      setPasswordMessage({
        type: "success",
        text: "Đổi mật khẩu thành công"
      })

      setPassword({ current: "", new: "", confirm: "" })
    } catch (err) {
      setPasswordMessage({
        type: "error",
        text: err.response?.data?.message || "Đổi mật khẩu thất bại"
      })
    } finally {
      setLoading(false)
    }
  }

  const togglePassword = field => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  /* ================= UI ================= */
  return (
    <>
      <Header />
      <div className="h-16" />

      <div className="px-4 md:px-36 py-10 font-futura-regular min-h-screen">
        <h1 className="font-frankfurter text-3xl md:text-5xl mb-10 text-center">
          Account Settings
        </h1>

        <div className="flex flex-col md:flex-row gap-10">
          {/* LEFT MENU */}
          <aside className="md:w-64 border h-fit">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full text-left px-5 py-4 border-b
                ${activeTab === "profile"
                  ? "bg-black text-white font-semibold"
                  : "hover:bg-gray-100"
                }`}
            >
              Personal Information
            </button>

            <button
              onClick={() => setActiveTab("password")}
              className={`w-full text-left px-5 py-4
                ${activeTab === "password"
                  ? "bg-black text-white font-semibold"
                  : "hover:bg-gray-100"
                }`}
            >
              Change Password
            </button>
          </aside>

          {/* RIGHT CONTENT */}
          <section className="flex-1 border p-6">
            {loading && (
              <p className="mb-4 text-sm text-gray-500">Loading...</p>
            )}

            {activeTab === "profile" && (
              <form onSubmit={saveProfile}>
                <h2 className="font-frankfurter text-xl mb-6">
                  Personal Information
                </h2>

                <FormMessage message={profileMessage} />

                <div className="space-y-4">
                  <input
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    placeholder="Full name"
                    className="w-full border p-3 outline-none"
                  />

                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    placeholder="Email"
                    className="w-full border p-3 outline-none"
                  />

                  <input
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    placeholder="Phone number"
                    className="w-full border p-3 outline-none"
                  />

                  <input
                    name="address"
                    value={profile.address}
                    onChange={handleProfileChange}
                    placeholder="Address"
                    className="w-full border p-3 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 bg-black text-white py-3 px-10 font-frankfurter disabled:opacity-60"
                >
                  Save Changes
                </button>
              </form>
            )}

            {activeTab === "password" && (
              <form onSubmit={handleChangePassword}>
                <h2 className="font-frankfurter text-xl mb-6">
                  Change Password
                </h2>

                <FormMessage message={passwordMessage} />

                {["current", "new", "confirm"].map(field => (
                  <div key={field} className="relative mb-4">
                    <input
                      type={showPassword[field] ? "text" : "password"}
                      name={field}
                      value={password[field]}
                      onChange={handlePasswordChange}
                      className="w-full border p-3 pr-10 outline-none"
                      placeholder={
                        field === "current"
                          ? "Current password"
                          : field === "new"
                            ? "New password"
                            : "Confirm new password"
                      }
                    />
                    <button
                      type="button"
                      onClick={() => togglePassword(field)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword[field] ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 border py-3 px-10 font-frankfurter disabled:opacity-60"
                >
                  Update Password
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
