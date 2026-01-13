// AdminRoutes.jsx
import { Route } from "react-router-dom"
import AdminLayout from "../layouts/AdminLayout"
import AdminRoute from "./AdminRoute"

// pages
import GuestManagement from "../page/Manage/Guest"
import TypeManagement from "../page/Manage/Type"
import OrderManagement from "../page/Manage/Order"
import ProductManagement from "../page/Manage/Product"
import ProductDetailManagement from "../page/Manage/Product/Detail"
import ProductEditManagement from "../page/Manage/Product/Edit"
import CreateProduct from "../page/Manage/Product/Create"
import RevenueManagement from "../page/Manage/Revenue"
import Chat from "../page/Manage/Chat"

const AdminRoutes = () => (
  <Route element={<AdminRoute />}>
    <Route path="/manage" element={<AdminLayout />}>
      <Route index element={<RevenueManagement />} />

      <Route path="guest" element={<GuestManagement />} />
      <Route path="types" element={<TypeManagement />} />
      <Route path="orders" element={<OrderManagement />} />

      <Route path="products">
        <Route index element={<ProductManagement />} />
        <Route path="create" element={<CreateProduct />} />
        <Route path=":id" element={<ProductDetailManagement />} />
        <Route path=":id/edit" element={<ProductEditManagement />} />
      </Route>
      <Route path="chat" element={<Chat />} />

      <Route path="revenue" element={<RevenueManagement />} />
    </Route>
  </Route>
)

export default AdminRoutes
