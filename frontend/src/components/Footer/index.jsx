import { Instagram, Facebook, Youtube, Twitter } from "lucide-react";

function Footer() {
    return (
        <>
            {/* Top message */}
            <div className="h-50 bg-[#c9c3fb] flex items-center justify-center p-20 md:p-10 font-futura-regular">
                <p className="text-xl text-center">
                    Hãy giữ liên lạc nhé! Chúng tôi sẽ thông báo cho bạn về các chương trình
                    khuyến mãi và những sản phẩm mới nhất!
                </p>
            </div>

            {/* Main footer */}
            <footer className="bg-[#fffbee] px-8 md:px-50 py-16 font-futura-regular">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-12 text-left">

                    {/* Thế giới Sanrio */}
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl mb-2">
                            Thế giới Sanrio
                        </h3>
                        <span className="text-sm cursor-pointer hover:text-pink-500">Hệ thống cửa hàng</span>
                        <span className="text-sm cursor-pointer hover:text-pink-500">Nhân vật dễ thương</span>
                        <span className="text-sm cursor-pointer hover:text-pink-500">Cuộc phiêu lưu siêu đáng yêu</span>
                        <span className="text-sm cursor-pointer hover:text-pink-500">Hello Kitty Cafe</span>
                        <span className="text-sm cursor-pointer hover:text-pink-500">Về Sanrio</span>
                    </div>

                    {/* Thêm nữa */}
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl  mb-2">
                            Thêm nữa
                        </h3>
                        <span className="text-sm cursor-pointer hover:text-pink-500">Thẻ quà tặng điện tử</span>
                        <span className="text-sm cursor-pointer hover:text-pink-500">Ưu đãi & khuyến mãi</span>
                        <span className="text-sm cursor-pointer hover:text-pink-500">Sản phẩm trên Amazon</span>
                        <span className="text-sm cursor-pointer hover:text-pink-500">Thông cáo báo chí</span>
                    </div>

                    {/* Cần hỗ trợ? */}
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl  mb-2">
                            Cần hỗ trợ?
                        </h3>
                        <span className="text-sm cursor-pointer hover:text-pink-500">Trung tâm đổi trả</span>
                        <span className="text-sm cursor-pointer hover:text-pink-500">Câu hỏi thường gặp</span>
                        <span className="text-sm cursor-pointer hover:text-pink-500">Liên hệ với chúng tôi</span>
                        <span className="text-sm cursor-pointer hover:text-pink-500">Cơ hội hợp tác kinh doanh</span>
                        <span className="text-sm cursor-pointer hover:text-pink-500">Tiêu chuẩn CPSIA</span>
                    </div>

                    {/* Tài nguyên */}
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl  mb-2">
                            Tài nguyên
                        </h3>
                        <span className="text-sm cursor-pointer hover:text-pink-500">
                            Chính sách bảo mật
                        </span>
                        <span className="text-sm cursor-pointer hover:text-pink-500">
                            Không bán hoặc chia sẻ dữ liệu cá nhân
                        </span>
                        <span className="text-sm cursor-pointer hover:text-pink-500">
                            Chính sách bảo mật trẻ em
                        </span>
                        <span className="text-sm cursor-pointer hover:text-pink-500">
                            Khả năng truy cập web
                        </span>
                        <span className="text-sm cursor-pointer hover:text-pink-500">
                            Điều khoản dịch vụ
                        </span>
                        <span className="text-sm cursor-pointer hover:text-pink-500">
                            Thông tin bản quyền
                        </span>
                    </div>

                    {/* Mạng xã hội */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-xl  mb-2">
                            Theo dõi chúng tôi
                        </h3>
                        <div className="flex gap-4">
                            <Instagram className="w-5 h-5 cursor-pointer hover:text-pink-500 transition" />
                            <Facebook className="w-5 h-5 cursor-pointer hover:text-pink-500 transition" />
                            <Youtube className="w-5 h-5 cursor-pointer hover:text-pink-500 transition" />
                            <Twitter className="w-5 h-5 cursor-pointer hover:text-pink-500 transition" />
                        </div>
                    </div>

                </div>
            </footer>
        </>
    );
}

export default Footer;
