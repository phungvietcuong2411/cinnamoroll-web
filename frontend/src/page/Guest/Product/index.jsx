import { useState, useEffect } from "react"
import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react"
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import { getAllProducts } from "../../../services/product.service"
import { getAllTypes } from "../../../services/type.service"
import { Link } from "react-router-dom"

function Product() {
    const [featured, setFeatured] = useState([])
    const [type, setType] = useState([])
    const [price, setPrice] = useState([])
    const [typeList, setTypeList] = useState([])

    const [openFeatured, setOpenFeatured] = useState(true)
    const [openType, setOpenType] = useState(true)
    const [openPrice, setOpenPrice] = useState(true)
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [openMobileFilter, setOpenMobileFilter] = useState(false)
    const [liked, setLiked] = useState([])

    const mapPriceToRange = (priceArr) => {
        let minPrice = null
        let maxPrice = null

        priceArr.forEach(p => {
            if (p === "Under 100.000 VND") {
                minPrice = minPrice === null ? 0 : minPrice
                maxPrice = maxPrice === null ? 100000 : Math.min(maxPrice, 100000)
            }

            if (p === "100.000 VND - 200.000 VND") {
                minPrice = minPrice === null ? 100000 : Math.min(minPrice, 100000)
                maxPrice = maxPrice === null ? 200000 : Math.max(maxPrice, 200000)
            }

            if (p === "200.000 VND - 300.000 VND") {
                minPrice = minPrice === null ? 200000 : Math.min(minPrice, 200000)
                maxPrice = maxPrice === null ? 300000 : Math.max(maxPrice, 300000)
            }

            if (p === "Over 300.000 VND") {
                minPrice = minPrice === null ? 300000 : Math.min(minPrice, 300000)
                maxPrice = null
            }
        })

        return { minPrice, maxPrice }
    }

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true)

                const { minPrice, maxPrice } = mapPriceToRange(price)

                const params = {}

                // nhiều type
                if (type.length > 0) {
                    params.types = type.join(",")
                }

                // price
                if (minPrice !== null) params.minPrice = minPrice
                if (maxPrice !== null) params.maxPrice = maxPrice


                const res = await getAllProducts(params)
                setProducts(res.data)

            } catch (err) {
                console.error("Fetch products failed", err)
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [type, price, featured])



    /* ================= DATA ================= */
    const featuredList = ["Best Seller", "New Arrival", "Trending", "On Sale"]

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const res = await getAllTypes()
                setTypeList(res.data)
            } catch (error) {
                console.error("Failed to fetch types", error)
            }
        }

        fetchTypes()
    }, [])


    const priceList = ["Under 100.000 VND", "100.000 VND - 200.000 VND", "200.000 VND - 300.000 VND", "Over 300.000 VND"]

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
                                        <label key={item.id} className="flex gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={type.includes(item.id)}
                                                onChange={() => toggleItem(item.id, setType)}
                                                className="accent-blue-500"
                                            />
                                            {item.nameType}
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
                            {products.map(product => (
                                <Link
                                    key={product.id}
                                    to={`/product/detail/${product.id}`}
                                    className="bg-[#f7f7f7] p-3 relative md:w-70 md:h-100 w-full h-auto flex flex-col items-center justify-between"
                                >

                                    <button
                                        onClick={() => toggleLike(i)}
                                        className="absolute top-3 right-3 z-10"
                                    >
                                    </button>
                                    <div>
                                        <img
                                            src={product.imgMain}
                                            alt={product.name}
                                            className="rounded-lg mb-3"
                                        />

                                        <p className="font-futura-regular text-sm my-4">
                                            {product.name}
                                        </p>

                                    </div>
                                    <p className="font-frankfurter border px-3 py-2 text-sm inline-block w-full text-center bg-white">
                                        {Number(product.price).toLocaleString("vi-VN")} VND
                                    </p>

                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Product
