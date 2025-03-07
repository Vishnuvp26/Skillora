import { useState, useEffect } from "react";
import FreelancerNav from "@/components/freelancer/FreelancerNav";
import { RootState } from "@/redux/store/store";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/test2.png";
import Footer from "@/components/landing/Footer";
import heroImage2 from "@/assets/test3.png";
import { ArrowUp } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const FreelancerHomepage = () => {
    const userName = useSelector((state: RootState) => state.user.name);
    const [showScroll, setShowScroll] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScroll(window.scrollY > 300);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="min-h-screen dark:bg-gray-950">
            <FreelancerNav />
            <div className="flex justify-between items-center p-6 mt-16">
                <h1 className="text-2xl font-semibold">
                    <span className="text-black dark:text-white">Welcome, </span>
                    <span className="font-bold text-[#0077B6] 
                        dark:bg-gradient-to-r dark:from-emerald-400 dark:to-cyan-400 
                        dark:bg-clip-text dark:text-transparent">
                        {userName}
                    </span>

                </h1>
            </div>

            {/* Section 1 */}
            <section className="flex flex-col md:flex-row items-center justify-center px-6 py-16">
                <div className="w-full md:w-1/2 flex justify-center">
                    <img src={heroImage} alt="Freelancer working" className="w-3/4 max-w-[480px] h-auto" />
                </div>

                <div className="w-full md:w-1/2 text-center md:text-left px-4">
                    <h2 className="text-4xl font-bold text-black dark:text-white">
                        Fire up your freelance career
                    </h2>
                    <p className="mt-4 text-base text-gray-700 dark:text-gray-300">
                        Focus on your passion while Skillora connects you with top clients. Join our global network of skilled freelancers and work in a secure, hassle-free environment.
                    </p>
                    <Button className="bg-[#0077B6] hover:bg-[#005f8c] text-white px-4 py-2 rounded-lg mt-6
                   dark:bg-gradient-to-r dark:from-emerald-400 dark:to-cyan-400 dark:text-black">
                        Start Now
                    </Button>

                </div>
            </section>

            {/* Section 2 */}
            <section className="bg-[#fbfbfb] dark:bg-gray-950 py-16 px-6">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-bold text-[#0077B6] dark:text-[#00FFE5]">DO IT</h3>
                            <p className="text-gray-700 dark:text-gray-300 text-md">
                                Showcase your expertise. Get verified and become a part of Skillora’s exclusive freelance community today.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-[#0077B6] dark:text-[#00FFE5]">WORK IT</h3>
                            <p className="text-gray-700 dark:text-gray-300 text-md">
                                Take on exciting projects through direct hires or explore opportunities in a competitive yet rewarding marketplace.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-[#0077B6] dark:text-[#00FFE5]">EARN IT</h3>
                            <p className="text-gray-700 dark:text-gray-300 text-md">
                                Boost your income with Skillora! Work with premium clients and get paid securely for your skills and dedication.
                            </p>
                        </div>
                    </div>

                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-bold text-black dark:text-white">
                            Start your dream job now. It's simple.
                        </h2>
                        <img
                            src={heroImage2}
                            alt="Start your dream job"
                            className="w-full max-w-xs md:max-w-none md:w-[550px] lg:w-[650px] xl:w-[600px] h-auto mt-12 mx-auto md:mx-0"
                        />
                    </div>
                </div>
            </section>

            {/* Section 3 */}
            <section>
                <div className="w-full px-4 max-w-[90%] sm:max-w-[80%] md:max-w-4xl mx-auto mt-12">
                    <h2 className="text-3xl font-bold text-black dark:text-white text-center mb-8">
                        Frequently Asked Questions
                    </h2>
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                            <AccordionTrigger>How does Skillora ensure secure payments?</AccordionTrigger>
                            <AccordionContent>
                                Skillora uses a secure escrow system to hold payments until project milestones are met, ensuring safety for both freelancers and clients.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-2">
                            <AccordionTrigger>How can I find the right projects on Skillora?</AccordionTrigger>
                            <AccordionContent>
                                You can browse job listings, participate in contests, or get matched with clients based on your skills and expertise.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-3">
                            <AccordionTrigger>What support does Skillora provide for freelancers?</AccordionTrigger>
                            <AccordionContent>
                                Skillora offers dispute resolution, project management tools, and community support to help freelancers grow their careers.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </section>
            
            <section>
                <Footer />
            </section>

            {/* Go to Top */}
            {showScroll && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 bg-[#0077B6] dark:bg-[#00FFE5] hover:bg-[#005f8c] dark:hover:bg-[#00d4c0] text-white dark:text-black p-3 rounded-full shadow-md transition-opacity duration-300 opacity-100"
                >
                    <ArrowUp size={24} />
                </button>
            )}
        </div>
    );
};

export default FreelancerHomepage;