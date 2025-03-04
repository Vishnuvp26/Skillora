import Body from "@/components/landing/Body";
import BrowseCategories from "@/components/landing/BrowseCategories";
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";

const Landing = () => {
    return (
        <>
            <Navbar />
            <Body />
            <BrowseCategories />
            <Footer/>
        </>
    );
};

export default Landing;