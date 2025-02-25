import Body from "@/components/landingComponents/Body";
import BrowseCategories from "@/components/landingComponents/BrowseCategories";
import Footer from "@/components/landingComponents/Footer";
import Navbar from "@/components/landingComponents/Navbar";

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