import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { login } from "../../../services/auth.service"
import { createUser } from "../../../services/user.service"
import LoadingOverlay from "../../../components/LoadingOverlay"

function Login() {
  const navigate = useNavigate()
  const [isRegister, setIsRegister] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("")

  const [form, setForm] = useState({
    account: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    gmail: "",
    address: ""
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      setMessage("")

      if (isRegister) {
        if (form.password.length < 6 || form.password.length > 15) {
          setMessageType("error")
          setMessage("Password must be between 6 and 15 characters")
          return
        }

        if (form.password !== form.confirmPassword) {
          setMessageType("error")
          setMessage("Password not match")
          return
        }

        await createUser({
          account: form.account,
          password: form.password,
          name: form.name,
          phone: form.phone,
          gmail: form.gmail,
          address: form.address
        })

        setMessageType("success")
        setMessage("Register success! Please login.")
        setIsRegister(false)
        return
      }

      await login({
        account: form.account,
        password: form.password
      })

      setMessageType("success")
      setMessage("Login success! Redirecting...")
      navigate("/home")

    } catch (err) {
      setMessageType("error")
      setMessage(err.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {loading && <LoadingOverlay />}
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">
        <div className="bg-white w-full max-w-md shadow-lg px-8 py-10">

          <Link
            to="/home"
            className="block text-center text-3xl md:text-4xl text-blue-400 font-frankfurter mb-4"
          >
            CINNAMOROLL
          </Link>

          <h2 className="font-futura-regular text-2xl mb-6 text-center">
            {isRegister ? "Create Account" : "Login"}
          </h2>

          {message && (
            <div
              className={`mb-4 rounded-lg px-4 py-3 text-sm font-medium font-futura-regular
                  ${messageType === "error"
                  ? "bg-red-100 text-red-600 border border-red-200"
                  : "bg-green-100 text-green-600 border border-green-200"
                }`}
            >
              {message}
            </div>
          )}


          <div className="flex flex-col gap-5">
            {isRegister && (
              <>
                <Input label="Account" name="account" onChange={handleChange} />
                <Input
                  label="Password (6–15 characters)"
                  type="password"
                  name="password"
                  onChange={handleChange}
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  onChange={handleChange}
                />
              </>
            )}
            {isRegister && (
              <>
                <Input label="Full Name" name="name" onChange={handleChange} />
                <Input label="Phone Number" name="phone" onChange={handleChange} />
                <Input label="Email" name="gmail" onChange={handleChange} />
                <Input label="Address" name="address" onChange={handleChange} />
              </>
            )}

            {!isRegister && (
              <>
                <Input label="Account" name="account" onChange={handleChange} />
                <Input label="Password" type="password" name="password" onChange={handleChange} />
              </>
            )}

            <button
              onClick={handleSubmit}
              className="mt-4 bg-blue-400 text-white py-2
               hover:bg-blue-500 transition font-semibold font-futura-regular"
            >
              {isRegister ? "Register" : "Login"}
            </button>
          </div>


          <div className="mt-6 text-center text-sm font-futura-regular">
            {isRegister ? (
              <p>
                Already have an account?{" "}
                <button
                  onClick={() => {
                    setIsRegister(false)
                    setMessage("")
                  }}
                  className="text-blue-500 hover:underline"
                >
                  Login
                </button>

              </p>
            ) : (
              <p>
                Don’t have an account?{" "}
                <button
                  onClick={() => {
                    setIsRegister(true)
                    setMessage("")
                  }}
                  className="text-blue-500 hover:underline"
                >
                  Create an account
                </button>

              </p>
            )}
          </div>

        </div>
      </div>
    </>
  )
}

function Input({ label, type = "text", name, onChange }) {
  return (
    <div className="font-futura-regular">
      <label className="block text-lg mb-1">{label}</label>
      <input
        name={name}
        type={type}
        onChange={onChange}
        className="w-full px-4 py-2 rounded-lg border border-gray-300
                   focus:border-blue-400 focus:ring-2 focus:ring-blue-200
                   outline-none transition"
      />
    </div>
  )
}

export default Login
