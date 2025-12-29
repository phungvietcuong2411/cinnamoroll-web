import { useEffect } from "react"
import { CheckCircle, XCircle, X } from "lucide-react"

function CartNotification({
  show,
  message,
  type = "success",
  onClose,
  duration = 5000
}) {
  useEffect(() => {
    if (!show) return

    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [show, duration, onClose])

  if (!show) return null

  return (
    <div className="fixed top-5 right-5 z-9999">
      <div
        className={`relative flex items-start gap-3 px-4 py-3
        border shadow-lg bg-white
        animate-slide-in-right
        ${type === "success"
            ? "border-black"
            : "border-black"
          }`}
      >
        {/* ICON */}
        {type === "success" ? (
          <CheckCircle className="text-green-500 mt-0.5" size={20} />
        ) : (
          <XCircle className="text-red-500 mt-0.5" size={20} />
        )}

        {/* MESSAGE */}
        <span className="text-sm text-gray-800 leading-snug pr-6">
          {message}
        </span>

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-black transition"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

export default CartNotification
