import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import AdminRoute from "./routes/AdminRoute"

// Guest pages
import Home from "./page/Guest/Home"
import Product from "./page/Guest/Product"
import Detail from "./page/Guest/Detail"
import Cart from "./page/Guest/Cart"
import Follow from "./page/Guest/Follow"
import Order from "./page/Guest/Order"
import Checkout from "./page/Guest/Checkout"
import Setting from "./page/Guest/Setting"
import PaymentSuccess from "./page/Guest/Payment/PaymentSuccess"
import PaymentFailed from "./page/Guest/Payment/PaymentFailed"
import GuestManagement from "./page/Manage/Guest"
import TypeManagement from "./page/Manage/Type"
import OrderManagement from "./page/Manage/Order"
import ProductManagement from "./page/Manage/Product"
import ProductDetailManagement from "./page/Manage/Product/Detail"
import RevenueManagement from "./page/Manage/Revenue"
import CreateProduct from "./page/Manage/Product/Create"
import ProductEditManagement from "./page/Manage/Product/Edit"
// import Support from "./page/Guest/Support"
// import Sale from "./page/Guest/Sale"
// import Cart from "./page/User/Cart"
// import Follows from "./page/User/Follows"
import Login from "./page/Guest/Login"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Redirect root */}
        <Route path="/" element={<Navigate to="/home" />} />

        {/* Guest */}
        <Route path="/home" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/product/detail/:id" element={<Detail />} />
        <Route path="/follows" element={<Follow />} />
        <Route path="/order" element={<Order />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
        <Route path="/manage/guest" element={<AdminRoute><GuestManagement /></AdminRoute>} />
        <Route path="/manage/types" element={<AdminRoute><TypeManagement /></AdminRoute>} />
        <Route path="/manage/orders" element={<AdminRoute><OrderManagement /></AdminRoute>} />
        <Route path="/manage/products" element={<AdminRoute><ProductManagement /></AdminRoute>} />
        <Route path="/manage/products/create" element={<AdminRoute><CreateProduct /></AdminRoute>} />
        <Route path="/manage/products/:id" element={<AdminRoute><ProductDetailManagement /></AdminRoute>} />
        <Route path="/manage/revenue" element={<AdminRoute><RevenueManagement /></AdminRoute>} />
        <Route path="/manage/products/:id/edit" element={<AdminRoute><ProductEditManagement /></AdminRoute>} />
        {/* User */}
        <Route path="/cart" element={<Cart />} />
        {/* <Route path="/follows" element={<Follows />} /> */}

        {/* Auth */}
        <Route path="/login" element={<Login />} />

        {/* 404 */}
        {/* <Route path="*" element={<Navigate to="/home" />} /> */}

      </Routes>
    </BrowserRouter>
  )
}

export default App
