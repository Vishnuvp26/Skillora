import Body from "@/components/landing/Body";
import BrowseCategories from "@/components/landing/BrowseCategories";
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import Testimonials from "@/components/landing/Testimonials";
import WhyChooseUs from "@/components/landing/WhyChooseUs";

const Landing = () => {
    return (
        <>
            <Navbar />
            <Body />
            <BrowseCategories />
            <WhyChooseUs/>
            <Testimonials/>
            <Footer/>
        </>
    );
};

export default Landing;