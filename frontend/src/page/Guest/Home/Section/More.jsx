import WallPaper from "../../../../assets/img/image_159.gif"
import GiftCard from "../../../../assets/img/image_57.jpg"
import ShopCalenders from "../../../../assets/img/image_55.jpg"
import Calender from "../../../../assets/img/image_151.png"

function More() {
    return (
        <div className="px-6 md:px-20 py-12">

            {/* Grid images */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center mb-20">
                <div className="flex flex-col">
                    <img src={GiftCard} alt="Gift Card" className="w-full max-w-[320px]" />
                    <p className="mt-5 font-frankfurter text-center text-xl">GIFT CARD</p>
                </div>
                <div>
                    <img src={ShopCalenders} alt="Shop Calendars" className="w-full max-w-[320px]" />
                    <p className="mt-5 font-frankfurter text-center text-xl">SHOP CALENDARS</p>
                </div>
                <div>
                    <img src={Calender} alt="Calendar" className="w-full max-w-[320px]" />
                    <p className="mt-5 font-frankfurter text-center text-xl">CALENDAR</p>
                </div>
                <div>
                    <img src={WallPaper} alt="Wallpaper" className="w-full max-w-[320px]" />
                    <p className="mt-5 font-frankfurter text-center text-xl">WALLPAPER</p>
                </div>
            </div>

            {/* Note */}
            <p className="mt-6 text-center text-sm md:text-base text-gray-600 font-futura-regular ">
                * Khám phá thêm nhiều sản phẩm Cinnamoroll, hình nền, thiệp quà tặng và lịch có sẵn trong cửa hàng của chúng tôi.
            </p>
        </div>
    )
}

export default More
