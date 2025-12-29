import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Heart } from "lucide-react"
import { Link } from "react-router-dom"
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import CartNotification from "../../../components/CartNotification"
import { getProductById, getRandomProducts } from "../../../services/product.service"
import { getMyFollows, followProduct, unfollowProduct } from "../../../services/follow.service"
import { addToCart } from "../../../services/cart.service"
import { LoaderCircle } from "lucide-react"
import LoadingOverlay from "../../../components/LoadingOverlay"

function Detail() {
    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [relatedProducts, setRelatedProducts] = useState([])
    const [qty, setQty] = useState(1)
    const [liked, setLiked] = useState(false)
    const [mainImage, setMainImage] = useState("")
    const [loading, setLoading] = useState(true)
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success"
    })
    const [adding, setAdding] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)

                const res = await getProductById(id)
                const data = res.data

                setProduct(data)
                setMainImage(data.imgMain)

                const randomRes = await getRandomProducts(6)
                setRelatedProducts(randomRes.data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [id])

    useEffect(() => {
        const checkFollowed = async () => {
            try {
                const res = await getMyFollows()
                console.log("FOLLOWS:", res.data)

                const followedIds = res.data.map(item => item.productId)
                setLiked(followedIds.includes(Number(id)))
            } catch (err) {
                console.error("Check follow failed", err.response || err)
            }
        }

        checkFollowed()
    }, [id])

    const handleAddToCart = async () => {
        if (adding) return

        try {
            setAdding(true)

            await addToCart(product.id, qty)

            setToast({
                show: true,
                message: "Added to cart successfully!",
                type: "success"
            })
        } catch (err) {
            console.error("Add to cart failed", err.response || err)

            if (err.response?.status === 401) {
                setToast({
                    show: true,
                    message: "Please login to add products to cart",
                    type: "error"
                })
            } else {
                setToast({
                    show: true,
                    message:
                        err.response?.data?.message ||
                        "Add to cart failed",
                    type: "error"
                })
            }
        } finally {
            setAdding(false)
        }
    }
    if (!product) {
        return (
            <>
                <Header />
                <div className="h-16" />
                {loading && <LoadingOverlay />}
                <div className="h-screen"></div>
                <Footer />
            </>
        )
    }


    const increase = () =>
        setQty(prev => (prev < product.quantity ? prev + 1 : prev))

    const decrease = () =>
        setQty(prev => (prev > 1 ? prev - 1 : 1))
    return (
        <>
            <Header />
            <div className="h-16" />
            <CartNotification
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(prev => ({ ...prev, show: false }))}
            />


            {/* ===== BREADCRUMB (DESKTOP ONLY) ===== */}
            <div className="hidden md:flex h-20 items-center font-futura-regular text-sm px-36 mb-8">
                <span>Home</span>
                <span className="mx-2">/</span>
                <span>Product</span>
                <span className="mx-2">/</span>
                <span>{product.name}</span>
            </div>

            {/* ===== DETAIL ===== */}
            <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16 px-4 md:px-36">
                {/* ===== LEFT - IMAGE ===== */}
                <div className="w-full md:w-160">
                    <img
                        src={mainImage}
                        alt={product.name}
                        className="w-full aspect-square object-cover md:h-160 md:w-160 mb-4"
                    />

                    {/* THUMBNAILS */}
                    <div className="flex gap-3 overflow-x-auto md:overflow-visible">
                        {[product.imgMain, ...product.images.map(i => i.url)].map(
                            (img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    alt=""
                                    onClick={() => setMainImage(img)}
                                    className={`h-20 w-20 md:h-27 md:w-27 cursor-pointer border ${mainImage === img ? "border-black" : "border-transparent"
                                        }`}
                                />
                            )
                        )}
                    </div>

                </div>

                {/* ===== RIGHT - INFO ===== */}
                <div className="w-full md:w-160">
                    <h1 className="font-frankfurter text-xl md:text-2xl mb-2">
                        {product.name}
                    </h1>

                    <div className="font-futura-regular text-sm mb-1">
                        Item#: {product.id}
                    </div>

                    <div className="font-frankfurter text-lg mb-2">
                        {Number(product.price).toLocaleString()} VND
                    </div>

                    <div className="font-futura-regular text-sm mb-4">
                        Stock available:{" "}
                        <span className="font-bold">{product.quantity}</span>
                    </div>

                    {/* ===== QUANTITY + LIKE ===== */}
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                        <div className="flex border items-center">
                            <button
                                onClick={decrease}
                                className="px-4 py-3 border-r"
                            >
                                -
                            </button>

                            <input
                                type="number"
                                min={1}
                                max={product.stock}
                                value={qty}
                                onChange={e => {
                                    const value = Number(e.target.value)
                                    if (isNaN(value)) return
                                    if (value < 1) setQty(1)
                                    else if (value > product.stock)
                                        setQty(product.stock)
                                    else setQty(value)
                                }}
                                className="w-20 text-center outline-none font-frankfurter py-2"
                            />

                            <button
                                onClick={increase}
                                className="px-4 py-3 border-l"
                            >
                                +
                            </button>
                        </div>

                        <button
                            onClick={async () => {
                                try {
                                    if (liked) {
                                        await unfollowProduct(product.id)
                                        setLiked(false)
                                    } else {
                                        await followProduct(product.id)
                                        setLiked(true)
                                    }
                                } catch (err) {
                                    console.error("Toggle follow failed", err)
                                }
                            }}
                            className="border p-3"
                        >

                            <Heart
                                className={
                                    liked
                                        ? "fill-red-500 text-red-500"
                                        : "text-gray-400"
                                }
                            />
                        </button>
                    </div>

                    {/* ===== ACTION BUTTONS ===== */}
                    <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-6">
                        <button
                            onClick={handleAddToCart}
                            disabled={adding}
                            className={`w-full border py-3 font-frankfurter transition flex items-center justify-center gap-2}`}
                        >
                            {adding ? (
                                <>
                                    <LoaderCircle className="w-5 h-5 animate-spin" />
                                    <span>Adding...</span>
                                </>
                            ) : (
                                "Add to cart"
                            )}
                        </button>


                    </div>

                    {/* ===== DESCRIPTION ===== */}
                    <div className="font-futura-regular text-sm leading-6">
                        <p className="mb-2">
                            Bundle up and let’s stay cozy with your favorite Sanrio
                            Characters! These winter-themed plush feature everyone in
                            puffer jackets with the most adorable hoods framing each
                            character’s face.
                        </p>
                        <p>♡ Sitting position</p>
                        <p>♡ Quilted puffer jacket and hood</p>
                        <p>♡ Embroidered and applique details</p>
                        <p>♡ Approx. 12”</p>
                    </div>
                </div>
            </div>

            {/* ===== RELATED ===== */}
            <div className="my-16 px-4 md:px-36">
                <h2 className="font-frankfurter text-3xl md:text-4xl text-center mb-8">
                    You might also like...
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-6">
                    {relatedProducts.map(p => (
                        <Link key={p.id} to={`/product/detail/${p.id}`}>
                            <div className="bg-[#f7f7f7] p-3">
                                <img
                                    src={p.imgMain}
                                    alt={p.name}
                                    className="rounded-lg mb-3 aspect-square object-cover"
                                />

                                <p className="font-futura-regular text-sm mb-2">
                                    {p.name}
                                </p>

                                <p className="font-frankfurter border px-3 py-2 text-sm text-center">
                                    {Number(p.price).toLocaleString()} VND
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

            </div>
            <Footer />
        </>
    )
}

export default Detail
