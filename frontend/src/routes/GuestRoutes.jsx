import { Route } from "react-router-dom"
import GuestLayout from "../layouts/GuestLayout"

// pages
import Home from "../page/Guest/Home"
import Product from "../page/Guest/Product"
import Detail from "../page/Guest/Detail"
import Cart from "../page/Guest/Cart"
import Follow from "../page/Guest/Follow"
import Order from "../page/Guest/Order"
import Checkout from "../page/Guest/Checkout"
import Setting from "../page/Guest/Setting"
import PaymentSuccess from "../page/Guest/Payment/PaymentSuccess"
import PaymentFailed from "../page/Guest/Payment/PaymentFailed"

const GuestRoutes = () => (
  <>
    <Route element={<GuestLayout />}>
      <Route path="/home" element={<Home />} />
      <Route path="/product" element={<Product />} />
      <Route path="/product/detail/:id" element={<Detail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/follows" element={<Follow />} />
      <Route path="/order" element={<Order />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/setting" element={<Setting />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/payment-failed" element={<PaymentFailed />} />
    </Route>
  </>
)

export default GuestRoutes
