import Cinnamoroll from "../../../../assets/img/pet.avif"
import { Link } from "react-router-dom"


function Introduce() {
  return (
    <div className="bg-[#bbd2fb] flex flex-col md:flex-row items-center justify-center
                    px-6 md:px-20 py-12 md:h-130 gap-10 mb-20">

      {/* Text */}
      <div className="flex flex-col max-w-xl md:w-160 justify-center items-center gap-6 text-center">
        <h1 className="font-frankfurter text-3xl md:text-5xl">
          Cinnamoroll
        </h1>

        <p className="font-futura-regular text-[16px] md:text-[18px]">
          Cinnamoroll là linh vật chính thức của quán cà phê Cinnamon.
           Cậu ấy khá nhút nhát nhưng rất thân thiện, và đôi khi ngủ gật trên đùi khách hàng. 
           Cậu ấy có thể bay lượn trên không trung bằng cách vẫy đôi tai to lớn của mình.
        </p>

        <Link
          to="/product"
          className="font-futura-regular border border-black px-8 py-2
                     transition-transform duration-300 ease-out
                     hover:scale-110 active:scale-105"
        >
          KHÁM PHÁ NGAY
        </Link>
      </div>

      {/* Image */}
      <img
        src={Cinnamoroll}
        alt="Cinnamoroll"
        className="w-full max-w-xs md:max-w-none md:w-131.5 h-auto md:h-62.5 object-contain"
      />
    </div>
  )
}

export default Introduce
