import { useState } from "react"
import { Heart } from "lucide-react"
import { Link } from "react-router-dom"
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"

const CLOUDINARY =
    "https://res.cloudinary.com/dhjs4exbp/image/upload/v1766834099/"

/* ===== TEMP DATA ===== */
const product = {
    id: 36,
    name: `Cinnamoroll 12" Plush (Winter Puffer Series)`,
    price: 100000,
    stock: 12,
    images: [
        "image_64_ndweuj.jpg",
        "image_66_acnsx0.jpg",
        "image_50_ueejft.jpg",
        "image_60_lbj00a.jpg",
        "image_59_axtqwl.jpg"
    ]
}

const relatedProducts = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    name: `Cinnamoroll Plush #${i + 1}`,
    price: 100000,
    image: "image_66_acnsx0.jpg"
}))

function Detail() {
    const [qty, setQty] = useState(1)
    const [liked, setLiked] = useState(false)
    const [mainImage, setMainImage] = useState(product.images[0])

    const increase = () =>
        setQty(prev => (prev < product.stock ? prev + 1 : prev))

    const decrease = () =>
        setQty(prev => (prev > 1 ? prev - 1 : 1))

    return (
        <>
            <Header />
            <div className="h-16" />

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
                        src={CLOUDINARY + mainImage}
                        alt={product.name}
                        className="w-full aspect-square object-cover md:h-160 md:w-160 mb-4"
                    />

                    {/* THUMBNAILS */}
                    <div className="flex gap-3 overflow-x-auto md:overflow-visible">
                        {product.images.map((img, i) => (
                            <img
                                key={i}
                                src={CLOUDINARY + img}
                                alt=""
                                onClick={() => setMainImage(img)}
                                className={`h-20 w-20 md:h-27 md:w-27 cursor-pointer border ${mainImage === img
                                        ? "border-black"
                                        : "border-transparent"
                                    }`}
                            />
                        ))}
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
                        {product.price.toLocaleString()} VND
                    </div>

                    <div className="font-futura-regular text-sm mb-4">
                        Stock available:{" "}
                        <span className="font-bold">{product.stock}</span>
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
                            onClick={() => setLiked(!liked)}
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
                        <button className="w-full border py-3 font-frankfurter">
                            Add to cart
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
                        <Link
                            key={p.id}
                            to={`/product/detail/${p.id}`}
                        >
                            <div className="bg-[#f7f7f7] p-3">
                                <img
                                    src={CLOUDINARY + p.image}
                                    alt={p.name}
                                    className="rounded-lg mb-3 aspect-square object-cover"
                                />

                                <p className="font-futura-regular text-sm mb-2">
                                    {p.name}
                                </p>

                                <p className="font-frankfurter border px-3 py-2 text-sm text-center">
                                    {p.price.toLocaleString()} VND
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="h-50 bg-[#c9c3fb] flex items-center justify-center font-frankfurter p-20 md:p-10">
                <p className="text-xl text-center">Let's stay in touch! We'll let you know about the latest sales and new releases!</p>
            </div>
            <Footer />
        </>
    )
}

export default Detail
