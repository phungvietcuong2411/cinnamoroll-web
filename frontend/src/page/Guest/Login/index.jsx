import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { login } from "../../../services/auth.service"
import { createUser } from "../../../services/user.service"
import LoadingOverlay from "../../../components/LoadingOverlay"

function Login() {
  const navigate = useNavigate()
  const [isRegister, setIsRegister] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("")

  // Quản lý visibility của các password field bằng object
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  })

  const [form, setForm] = useState({
    account: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    gmail: "",
    address: "",
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const togglePasswordVisibility = (key) => {
    setPasswordVisibility((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const switchMode = (register) => {
    setIsRegister(register)
    setMessage("")
    // Optional: clear form nếu muốn
    // setForm({ account: "", password: "", ... })
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      setMessage("")

      if (isRegister) {
        if (form.password.length < 6 || form.password.length > 15) {
          setMessageType("error")
          setMessage("Mật khẩu phải từ 6 đến 15 ký tự")
          return
        }
        if (form.password !== form.confirmPassword) {
          setMessageType("error")
          setMessage("Mật khẩu và mật khẩu xác nhận không khớp nhau")
          return
        }

        await createUser({
          account: form.account,
          password: form.password,
          name: form.name,
          phone: form.phone,
          gmail: form.gmail,
          address: form.address,
        })

        setMessageType("success")
        setMessage("Đăng ký thành công! Đang chuyển hướng")
        setTimeout(() => switchMode(false), 2000) // Tự chuyển về login sau 2s
        return
      }

      await login({
        account: form.account,
        password: form.password,
      })

      setMessageType("success")
      setMessage("Đăng nhập thành công! Đang chuyển hướng")
      navigate("/home")
    } catch (err) {
      setMessageType("error")
      setMessage(err.response?.data?.message || "Đang xảy ra lỗi")
    } finally {
      setLoading(false)
    }
  }

  // === CẤU HÌNH FIELDS ===
  const fieldsConfig = isRegister
    ? [
        { label: "Tài khoản", name: "account" },
        { label: "Mật khẩu (6–15 ký tự)", name: "password", toggle: "password" },
        { label: "Xác nhận mật khẩu", name: "confirmPassword", toggle: "confirmPassword" },
        { label: "Tên", name: "name" },
        { label: "Số điện thoại", name: "phone" },
        { label: "Email", name: "gmail" },
        { label: "Địa chỉ", name: "address" },
      ]
    : [
        { label: "Tài khoản", name: "account" },
        { label: "Mật khẩu", name: "password", toggle: "password" },
      ]

  return (
    <>
      {loading && <LoadingOverlay />}
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">
        <div className="bg-white w-full max-w-md shadow-lg px-8 py-10">
          <Link to="/home" className="block text-center text-3xl md:text-4xl text-blue-400 font-frankfurter mb-4">
            CINNAMOROLL
          </Link>

          <h2 className="font-futura-regular text-2xl mb-6 text-center">
            {isRegister ? "Đăng ký" : "Đăng nhập"}
          </h2>

          {message && (
            <div
              className={`mb-4 rounded-lg px-4 py-3 text-sm font-medium font-futura-regular ${
                messageType === "error"
                  ? "bg-red-100 text-red-600 border border-red-200"
                  : "bg-green-100 text-green-600 border border-green-200"
              }`}
            >
              {message}
            </div>
          )}

          <div className="flex flex-col gap-5">
            {fieldsConfig.map((field) => (
              <Input
                key={field.name}
                label={field.label}
                name={field.name}
                onChange={handleChange}
                type={field.toggle ? "password" : "text"}
                showToggle={!!field.toggle}
                isVisible={passwordVisibility[field.toggle || ""]}
                onToggle={() => togglePasswordVisibility(field.toggle)}
              />
            ))}

            <button
              onClick={handleSubmit}
              className="mt-4 bg-blue-400 text-white py-2 hover:bg-blue-500 transition font-semibold font-futura-regular"
            >
              {isRegister ? "Đăng ký" : "Đăng nhập"}
            </button>
          </div>

          <div className="mt-6 text-center text-sm font-futura-regular">
            {isRegister ? (
              <p>
                Bạn đã có tài khoản?{" "}
                <button onClick={() => switchMode(false)} className="text-blue-500 hover:underline">
                  Đăng nhập ngay
                </button>
              </p>
            ) : (
              <p>
                Bạn chưa có tài khoản?{" "}
                <button onClick={() => switchMode(true)} className="text-blue-500 hover:underline">
                  Đăng ký ngay!
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

// Component Input được cải thiện nhẹ
function Input({ label, name, type = "text", onChange, showToggle = false, isVisible, onToggle }) {
  return (
    <div className="font-futura-regular relative">
      <label className="block text-lg mb-1">{label}</label>
      <input
        name={name}
        type={showToggle && isVisible ? "text" : type}
        onChange={onChange}
        className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition"
      />
      {showToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-10.5 text-gray-500 hover:text-gray-700"
        >
          {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
  )
}

export default Login