import Header from "../../../components/Header/index"
import Footer from "../../../components/Footer/index"
import More from "../../../page/Guest/Home/Section/More"
import Introduce from "./Section/Introduce"


function Home() {
    return(
        <>
            <Header />
            <div className="h-16"></div>
            <Introduce />
            <More />
            <div className="h-50 bg-[#c9c3fb] flex items-center justify-center font-frankfurter p-20 md:p-10">
                <p className="text-xl text-center">Let's stay in touch! We'll let you know about the latest sales and new releases!</p>
            </div>
            <Footer />
        </>
    )
}

export default Home;