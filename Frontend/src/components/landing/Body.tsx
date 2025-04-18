import { motion } from "framer-motion";
import { CheckCircle, Briefcase, DollarSign } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import image1 from '../../assets/image1.jpg';
import image2 from '../../assets/image2.jpg';
import image3 from '../../assets/image3.jpg';
import landing from '../../assets/landing.jpg'
import { Button } from "../ui/button";
import ChatBot from "./ChatBot";

const Body = () => {
    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col lg:flex-row items-center justify-between w-[90%] lg:w-[80%] mx-auto mt-32 lg:mt-36"
            >
                {/* Left Section: Text */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    className="w-full lg:w-1/2 text-left"
                >
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-[1.3]">
                        We <span className="text-[#0077B6] dark:bg-gradient-to-r dark:from-green-300 dark:via-teal-400 dark:to-cyan-500 dark:bg-clip-text dark:text-transparent">
                            connect
                        </span>
                        <br />
                        people to bring <br />
                        projects to <span className="text-[#0077B6] dark:bg-gradient-to-r dark:from-green-300 dark:via-teal-400 dark:to-cyan-500 dark:bg-clip-text dark:text-transparent">life</span>
                    </h1>
                    <h3 className="text-white-500 dark:text-gray-400 mx-auto mt-10">
                        Find high-quality talent or open jobs with the <br />
                        help of AI tools that keep you in control.
                    </h3>
                </motion.div>

                {/* Right Section: Carousel */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                    className="w-full lg:w-1/2 flex justify-end mt-10 lg:mt-0"
                >
                    <Carousel className="w-full max-w-md overflow-hidden relative">
                        <CarouselContent>
                            <CarouselItem className="flex justify-center">
                                <img src={image1} alt="Project Collaboration" className="rounded-lg shadow-lg w-full object-cover" />
                            </CarouselItem>
                            <CarouselItem className="flex justify-center">
                                <img src={image2} alt="Teamwork" className="rounded-lg shadow-lg w-full object-cover" />
                            </CarouselItem>
                            <CarouselItem className="flex justify-center">
                                <img src={image3} alt="Freelancing" className="rounded-lg shadow-lg w-full object-cover" />
                            </CarouselItem>
                        </CarouselContent>
                        <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10" />
                        <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10" />
                    </Carousel>
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
                className="relative flex flex-col-reverse lg:flex-row items-center justify-between w-[90%] lg:w-[80%] mx-auto mt-16 lg:mt-28"
            >
                {/* Left: Increased Image Size */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
                    className="w-full lg:w-[50%] mt-10 lg:mt-0"
                >
                    <img src={landing} alt="Work Collaboration" className="rounded-sm shadow-lg w-[500px] h-auto mx-auto" />
                </motion.div>

                {/* Right: Glassmorphic Text Box */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 1 }}
                    className="relative z-10"
                >
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-[1.3]">
                        Up your work game, it’s easy
                    </h2>
                    <ul className="mt-8 space-y-6 text-lg">
                        <li className="flex items-start space-x-3">
                            <CheckCircle className="text-[#0077B6] dark:text-[#00FFE5] w-7 h-7" />
                            <div>
                                <h3 className="text-gray-900 dark:text-white text-xl font-bold ">No cost to join</h3>
                                <h3 className="text-gray-800 dark:text-gray-400 text-sm">
                                    Register and browse talent profiles, explore projects.
                                </h3>
                            </div>
                        </li>
                        <li className="flex items-start space-x-3">
                            <Briefcase className="text-[#0077B6] dark:text-[#00FFE5] w-7 h-7" />
                            <div>
                                <h3 className="text-gray-900 dark:text-white text-xl font-bold">Post a job and hire top talent</h3>
                                <h3 className="text-gray-800 dark:text-gray-400 text-sm">
                                    Finding talent is easy post a job or let us search for you!
                                </h3>
                            </div>
                        </li>
                        <li className="flex items-start space-x-3">
                            <DollarSign className="text-[#0077B6] dark:text-[#00FFE5] w-7 h-7" />
                            <div>
                                <h3 className="text-gray-900 dark:text-white text-xl font-bold">Work without breaking the bank</h3>
                                <h3 className="text-gray-800 dark:text-gray-400 text-sm">
                                    Makes it affordable to up your work.
                                </h3>
                            </div>
                        </li>
                    </ul>
                    <div className="mt-6 flex justify-center md:justify-start">
                        <Button className="px-5 py-3 border border-[#0077B6] text-[#0077B6] bg-transparent 
                        hover:bg-[#0077B611] hover:text-[#0077B6] 
                        dark:border-[#00FFE5] dark:text-[#00FFE5] dark:hover:bg-[#00FFE511] dark:hover:text-[#00FFE5] rounded-lg">
                            Get started
                        </Button>
                    </div>
                </motion.div>
            </motion.div>
            <ChatBot />
        </>
    )
};

export default Body;