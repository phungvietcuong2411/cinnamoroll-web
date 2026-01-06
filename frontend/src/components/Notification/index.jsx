import { useState, useEffect, createContext, useContext } from "react";
import { X } from "lucide-react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Tự động ẩn sau 3 giây
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Khu vực hiển thị toast */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm font-futura-regular">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white
              transition-all duration-300 ease-in-out transform
              ${toast.type === "success" ? "bg-green-600" : ""}
              ${toast.type === "error" ? "bg-red-600" : ""}
              ${toast.type === "warning" ? "bg-yellow-600" : ""}
              ${toast.type === "info" ? "bg-blue-600" : ""}
            `}
          >
            <span className="font-medium">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-auto p-1 rounded-full hover:bg-white/20"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Hook để dùng toast ở bất kỳ component nào
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast phải được dùng trong ToastProvider");
  }
  return context;
};