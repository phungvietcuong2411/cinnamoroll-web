import { Outlet } from "react-router-dom" 
import Header from "../components/Header"
import Footer from "../components/Footer"
import ChatWidget from "../components/Chat"

function GuestLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <ChatWidget />
      
    </>
  )
}

export default GuestLayout
