import { useState } from "react"
import { Link } from "react-router-dom"

function Login() {
  const [isRegister, setIsRegister] = useState(false)

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md shadow-lg px-8 py-10">

        {/* LOGO */}
        <Link
          to="/home"
          className="block text-center text-3xl md:text-4xl text-blue-400 font-frankfurter mb-4"
        >
          CINNAMOROLL
        </Link>

        {/* TITLE */}
        <h2 className="font-futura-regular text-2xl mb-6 text-center">
          {isRegister ? "Create Account" : "Login"}
        </h2>

        {/* FORM */}
        <form className="flex flex-col gap-5">

          {/* ACCOUNT */}
          <div className="font-futura-regular">
            <label className="block text-lg mb-1">
              Account
            </label>
            <input
              type="text"
              placeholder="Enter your account"
              className="w-full px-4 py-2 rounded-lg border border-gray-300
                         focus:border-blue-400 focus:ring-2 focus:ring-blue-200
                         outline-none transition"
            />
          </div>

          {/* PASSWORD */}
          <div className="font-futura-regular">
            <label className="block text-lg mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 rounded-lg border border-gray-300
                         focus:border-blue-400 focus:ring-2 focus:ring-blue-200
                         outline-none transition"
            />
          </div>

          {/* CONFIRM PASSWORD - REGISTER */}
          {isRegister && (
            <div className="font-futura-regular">
              <label className="block text-lg mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Re-enter your password"
                className="w-full px-4 py-2 rounded-lg border border-gray-300
                           focus:border-blue-400 focus:ring-2 focus:ring-blue-200
                           outline-none transition"
              />
            </div>
          )}

          {/* SUBMIT */}
          <button
            type="button"
            className="mt-4 bg-blue-400 text-white py-2
                       hover:bg-blue-500 transition font-semibold font-futura-regular"
          >
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        {/* SWITCH MODE */}
        <div className="mt-6 text-center text-sm font-futura-regular">
          {isRegister ? (
            <p>
              Already have an account?{" "}
              <button
                onClick={() => setIsRegister(false)}
                className="text-blue-500 hover:underline"
              >
                Login
              </button>
            </p>
          ) : (
            <p>
              Don’t have an account?{" "}
              <button
                onClick={() => setIsRegister(true)}
                className="text-blue-500 hover:underline"
              >
                Create an account
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  )
}

export default Login
