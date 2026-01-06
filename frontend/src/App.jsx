import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

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
        <Route path="/manage/guest" element={<GuestManagement />} />
        <Route path="/manage/types" element={<TypeManagement />} />
        <Route path="/manage/orders" element={<OrderManagement />} />
        <Route path="/manage/products" element={<ProductManagement />} />
        <Route path="/manage/products/:id" element={<ProductDetailManagement />} />
        <Route path="/manage/revenue" element={<RevenueManagement />} />
        <Route path="/manage/products/create" element={<CreateProduct />} />

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
