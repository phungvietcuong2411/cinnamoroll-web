import { Instagram, Facebook, Youtube, Twitter } from "lucide-react";

function Footer() {
    return (
        <>
            <div className="h-50 bg-[#c9c3fb] flex items-center justify-center font-frankfurter p-20 md:p-10">
                <p className="text-xl text-center">Let's stay in touch! We'll let you know about the latest sales and new releases!</p>
            </div>
            <footer className="bg-[#fffbee] px-8 md:px-50 py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-12 text-left">

                    {/* World of Sanrio */}
                    <div className="flex flex-col gap-2">
                        <h3 className="text-[15px] font-frankfurter mb-2">
                            World of Sanrio
                        </h3>
                        <span className="text-sm cursor-pointer hover:text-pink-500">Store Locator</span>
                        <span className="text-sm cursor-pointer hover:text-pink-500">Character Goodies</span>
                        <span className="text-sm cursor-pointer hover:text-pink-500">Supercute Adventures</span>
                        <span className="text-sm cursor-pointer hover:text-pink-500">Hello Kitty Cafe</span>
                        <span className="text-sm cursor-pointer hover:text-pink-500">About Sanrio</span>
                    </div>

                    {/* More */}
                    <div className="flex flex-col gap-2">
                        <h3 className="text-[15px] font-frankfurter mb-2">
                            More
                        </h3>
                        <span className="text-sm cursor-pointer hover:text-pink-500">e-Gift Cards</span>
                        <span className="text-sm cursor-pointer hover:text-pink-500">Deals and Promos</span>
                        <span className="text-sm cursor-pointer hover:text-pink-500">Merch by Amazon</span>
                        <span className="text-sm cursor-pointer hover:text-pink-500">Press Releases</span>
                    </div>

                    {/* Need Help */}
                    <div className="flex flex-col gap-2">
                        <h3 className="text-[15px] font-frankfurter mb-2">
                            Need Help?
                        </h3>
                        <span className="text-sm cursor-pointer hover:text-pink-500">Returns Center</span>
                        <span className="text-sm cursor-pointer hover:text-pink-500">FAQs</span>
                        <span className="text-sm cursor-pointer hover:text-pink-500">Contact Us</span>
                        <span className="text-sm cursor-pointer hover:text-pink-500">Business Opportunities</span>
                        <span className="text-sm cursor-pointer hover:text-pink-500">CPSIA</span>
                    </div>

                    {/* Resources */}
                    <div className="flex flex-col gap-2">
                        <h3 className="text-[15px] font-frankfurter mb-2">
                            Resources
                        </h3>
                        <span className="text-sm cursor-pointer hover:text-pink-500">
                            Privacy Policy
                        </span>
                        <span className="text-sm cursor-pointer hover:text-pink-500">
                            Do Not Sell or Share My Personal Information
                        </span>
                        <span className="text-sm cursor-pointer hover:text-pink-500">
                            Children's Privacy Policy
                        </span>
                        <span className="text-sm cursor-pointer hover:text-pink-500">
                            Web Accessibility
                        </span>
                        <span className="text-sm cursor-pointer hover:text-pink-500">
                            Terms of Service
                        </span>
                        <span className="text-sm cursor-pointer hover:text-pink-500">
                            Copyright Info
                        </span>
                    </div>

                    {/* Social */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-[15px] font-frankfurter mb-2">
                            Follow Us
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
