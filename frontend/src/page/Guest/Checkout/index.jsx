import { useState } from "react"
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"

const cartItems = [
  {
    id: 1,
    name: 'Cinnamoroll 12" Plush',
    price: 100000,
    qty: 2,
    image: "https://res.cloudinary.com/dhjs4exbp/image/upload/v1766834099/image_66_acnsx0.jpg"
  },
  {
    id: 2,
    name: "Kuromi Plush",
    price: 120000,
    qty: 1,
    image: "https://res.cloudinary.com/dhjs4exbp/image/upload/v1766834099/image_64_ndweuj.jpg"
  }
]

function Checkout() {
  const [payment, setPayment] = useState("COD")

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  )

  const shippingFee = 30000
  const total = subtotal + shippingFee

  const handleSubmit = e => {
    e.preventDefault()

    const data = {
      paymentMethod: payment
    }

    if (payment === "VNPAY") {
      alert("Redirect to VNPAY...")
    } else {
      alert("Order placed with COD!")
    }

    console.log("ORDER DATA:", data)
  }

  return (
    <>
      <Header />
      <div className="h-16" />

      <div className="px-4 md:px-36 py-10 font-futura-regular">
        <h1 className="font-frankfurter text-3xl md:text-5xl mb-8 text-center">
          Checkout
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-10"
        >
          {/* LEFT - FORM */}
          <div className="space-y-6">
            {/* CUSTOMER INFO */}
            <div>
              <h2 className="font-frankfurter text-xl mb-3">
                Customer Information
              </h2>

              <div className="space-y-3">
                <input
                  required
                  placeholder="Full name"
                  className="w-full border p-3 outline-none"
                />
                <input
                  required
                  placeholder="Phone number"
                  className="w-full border p-3 outline-none"
                />
                <input
                  type="email"
                  required
                  placeholder="Email"
                  className="w-full border p-3 outline-none"
                />
              </div>
            </div>

            {/* ADDRESS */}
            <div>
              <h2 className="font-frankfurter text-xl mb-3">
                Shipping Address
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  required
                  placeholder="Street address"
                  className="border p-3 outline-none md:col-span-2"
                />
              </div>
            </div>

            {/* PAYMENT */}
            <div>
              <h2 className="font-frankfurter text-xl mb-3">
                Payment Method
              </h2>

              <div className="space-y-3">
                <label className="flex items-center gap-3 border p-3 cursor-pointer">
                  <input
                    type="radio"
                    checked={payment === "COD"}
                    onChange={() => setPayment("COD")}
                  />
                  Cash on Delivery (COD)
                </label>

                <label className="flex items-center gap-3 border p-3 cursor-pointer">
                  <input
                    type="radio"
                    checked={payment === "VNPAY"}
                    onChange={() => setPayment("VNPAY")}
                  />
                  VNPAY
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT - SUMMARY */}
          <div className="border p-5 h-fit">
            <h2 className="font-frankfurter text-xl mb-4">
              Order Summary
            </h2>

            <div className="space-y-4 mb-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-3">
                  <img
                    src={item.image}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.price.toLocaleString()} VND × {item.qty}
                    </p>
                  </div>
                  <div className="text-sm">
                    {(item.price * item.qty).toLocaleString()} VND
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{subtotal.toLocaleString()} VND</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shippingFee.toLocaleString()} VND</span>
              </div>
              <div className="flex justify-between font-frankfurter text-lg">
                <span>Total</span>
                <span>{total.toLocaleString()} VND</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-4 mt-6 font-frankfurter"
            >
              Place Order
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </>
  )
}

export default Checkout
