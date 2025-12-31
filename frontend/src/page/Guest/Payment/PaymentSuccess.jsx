import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { CheckCircle } from "lucide-react"
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"

function PaymentSuccess() {
    const navigate = useNavigate()

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/home")
        }, 5000)

        return () => clearTimeout(timer)
    }, [navigate])

    return (
        <>
            <Header />
            <div className="h-16" />

            <div className="min-h-[70vh] flex items-center justify-center px-4">
                <div className="bg-white border rounded-xl shadow-md
                                max-w-md w-full text-center p-8">

                    <CheckCircle className="mx-auto text-green-500 w-16 h-16 mb-4" />

                    <h1 className="font-frankfurter text-2xl mb-2">
                        Payment Successful!
                    </h1>

                    <p className="font-futura-regular text-gray-600 mb-6">
                        Thank you for your purchase.
                        <br />
                        You will be redirected to the homepage shortly.
                    </p>

                    <button
                        onClick={() => navigate("/home")}
                        className="w-full border py-3 font-frankfurter
                                   hover:bg-black hover:text-white transition"
                    >
                        Back to Home
                    </button>

                    <p className="mt-4 text-sm text-gray-400 font-futura-regular">
                        Redirecting in 5 seconds...
                    </p>
                </div>
            </div>

            <Footer />
        </>
    )
}

export default PaymentSuccess
