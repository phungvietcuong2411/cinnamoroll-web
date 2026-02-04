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
        </>
    )
}

export default Home;