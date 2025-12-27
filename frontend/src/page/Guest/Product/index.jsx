import { useState } from "react"
import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react"
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import { Link } from "react-router-dom"

function Product() {
    /* ================= STATE ================= */
    const [featured, setFeatured] = useState([])
    const [type, setType] = useState([])
    const [price, setPrice] = useState([])

    const [openFeatured, setOpenFeatured] = useState(true)
    const [openType, setOpenType] = useState(true)
    const [openPrice, setOpenPrice] = useState(true)

    const [openMobileFilter, setOpenMobileFilter] = useState(false)
    const [liked, setLiked] = useState([])

    /* ================= DATA ================= */
    const featuredList = ["Best Seller", "New Arrival", "Trending", "On Sale"]
    const typeList = ["Plush", "Keychain", "Stationery", "Bag", "Figure"]
    const priceList = ["Under $20", "$20 - $50", "$50 - $100", "Over $100"]

    /* ================= HANDLER ================= */
    const toggleItem = (value, setState) => {
        setState(prev =>
            prev.includes(value)
                ? prev.filter(item => item !== value)
                : [...prev, value]
        )
    }

    const toggleLike = id => {
        setLiked(prev =>
            prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id]
        )
    }

    /* ================= UI ================= */
    return (
        <>
            <Header />
            <div className="h-16" />

            <div className="px-4 md:px-10 py-6">
                {/* MOBILE FILTER BUTTON */}
                <button
                    onClick={() => setOpenMobileFilter(true)}
                    className="md:hidden flex items-center gap-2 mb-6 text-sm font-futura-regular"
                >
                    Filter
                    <ChevronRight size={18} />
                </button>

                <div className="flex gap-8">
                    {/* ================= FILTER ================= */}
                    <aside
                        className={`
              bg-white p-4
              md:w-64 md:h-fit md:rounded-xl
              md:sticky md:top-24 md:left-10
              md:block

              ${openMobileFilter
                                ? "fixed inset-0 top-16 z-50"
                                : "hidden"}
            `}
                    >
                        {/* MOBILE HEADER */}
                        <div className="flex items-center gap-3 mb-6 md:hidden">
                            <button onClick={() => setOpenMobileFilter(false)}>
                                <ChevronLeft size={22} />
                            </button>
                            <h2 className="font-frankfurter text-xl">Filter by</h2>
                        </div>

                        {/* DESKTOP HEADER */}
                        <h1 className="font-frankfurter text-2xl mb-6 hidden md:block">
                            PRODUCT
                        </h1>

                        {/* FEATURED */}
                        <div className="border-b pb-4 mb-4">
                            <button
                                onClick={() => setOpenFeatured(!openFeatured)}
                                className="flex justify-between w-full text-sm"
                            >
                                Featured
                                {openFeatured
                                    ? <ChevronLeft size={18} />
                                    : <ChevronRight size={18} />}
                            </button>

                            {openFeatured && (
                                <div className="mt-3 space-y-2">
                                    {featuredList.map(item => (
                                        <label key={item} className="flex gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={featured.includes(item)}
                                                onChange={() => toggleItem(item, setFeatured)}
                                                className="accent-blue-500"
                                            />
                                            {item}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* TYPE */}
                        <div className="border-b pb-4 mb-4">
                            <button
                                onClick={() => setOpenType(!openType)}
                                className="flex justify-between w-full text-sm"
                            >
                                Product Type
                                {openType
                                    ? <ChevronLeft size={18} />
                                    : <ChevronRight size={18} />}
                            </button>

                            {openType && (
                                <div className="mt-3 space-y-2">
                                    {typeList.map(item => (
                                        <label key={item} className="flex gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={type.includes(item)}
                                                onChange={() => toggleItem(item, setType)}
                                                className="accent-blue-500"
                                            />
                                            {item}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* PRICE */}
                        <div className="border-b pb-4 mb-4">
                            <button
                                onClick={() => setOpenPrice(!openPrice)}
                                className="flex justify-between w-full text-sm"
                            >
                                Price
                                {openPrice
                                    ? <ChevronLeft size={18} />
                                    : <ChevronRight size={18} />}
                            </button>

                            {openPrice && (
                                <div className="mt-3 space-y-2">
                                    {priceList.map(item => (
                                        <label key={item} className="flex gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={price.includes(item)}
                                                onChange={() => toggleItem(item, setPrice)}
                                                className="accent-blue-500"
                                            />
                                            {item}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => {
                                setFeatured([])
                                setType([])
                                setPrice([])
                            }}
                            className="text-sm text-blue-500 hover:underline"
                        >
                            Clear filters
                        </button>
                    </aside>

                    {/* ================= PRODUCT GRID ================= */}
                    <section className="flex-1 md:ml-0">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                            {[...Array(16)].map((_, i) => (
                                <Link
                                    key={i}
                                    to="/product/detail/1"
                                    className="bg-[#f7f7f7] p-3 relative md:w-70 md:h-94 w-full h-auto "
                                >
                                    <button
                                        onClick={() => toggleLike(i)}
                                        className="absolute top-3 right-3 z-10"
                                    >
                                    </button>

                                    <img
                                        src="https://res.cloudinary.com/dhjs4exbp/image/upload/v1766828305/image_66_acnsx0.jpg"
                                        alt=""
                                        className="rounded-lg mb-3"
                                    />

                                    <p className="font-futura-regular text-sm my-4">
                                        Cinnamoroll Plush #{i + 1}
                                    </p>

                                    <p className="font-frankfurter border px-3 py-2 text-sm inline-block w-full text-center bg-white">
                                        100.000 VND
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
            <div className="h-50 bg-[#c9c3fb] flex items-center justify-center font-frankfurter p-20 md:p-10">
                <p className="text-xl text-center">Let's stay in touch! We'll let you know about the latest sales and new releases!</p>
            </div>
            <Footer />
        </>
    )
}

export default Product
