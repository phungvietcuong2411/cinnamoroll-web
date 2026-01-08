import WallPaper from "../../../../assets/img/image_159.gif"
import GiftCard from "../../../../assets/img/image_57.jpg"
import Calender from "../../../../assets/img/image_151.png"


function More() {
    return (
        <div className="px-6 md:px-20 py-12">
            {/* Grid images */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center mb-20">
                <div className="flex flex-col">
                    <img src={GiftCard} alt="Gift Card" className="w-full max-w-[320px]" />
                    <p className="mt-5 font-frankfurter text-center text-xl">GIFT CARD</p>
                </div>
                <a
                    href="https://cdn.shopify.com/s/files/1/0416/8083/0620/files/01_January_FOTM_Calendar_2026_RGB.pdf?v=1767030146"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col"
                >
                    <img src={Calender} alt="Calendar" className="w-full max-w-[320px]" />
                    <p className="mt-5 font-frankfurter text-center text-xl">CALENDAR</p>
                </a>
                <div>
                    <img src={WallPaper} alt="Wallpaper" className="w-full max-w-[320px]" />
                    <p className="mt-5 font-frankfurter text-center text-xl">WALLPAPER</p>
                </div>
            </div>

            {/* Note */}
            <p className="mt-16 max-w-4xl mx-auto text-center text-base md:text-lg italic text-gray-600 font-futura-regular leading-relaxed px-4">
                * Khám phá thêm nhiều sản phẩm Cinnamoroll, hình nền, thiệp quà tặng và lịch có sẵn trong cửa hàng của chúng tôi.
            </p>
        </div>
    )
}

export default More
