import { motion } from "framer-motion";
import { CheckCircle, Briefcase, DollarSign } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import image1 from '../../assets/image1.jpg';
import image2 from '../../assets/image2.jpg';
import image3 from '../../assets/image3.jpg';
import landing from '../../assets/landing.jpg'

const Body = () => {
    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col lg:flex-row items-center justify-between w-[90%] lg:w-[80%] mx-auto mt-32 lg:mt-40"
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
                    <Carousel className="w-full max-w-md">
                        <CarouselContent>
                            <CarouselItem>
                                <img src={image1} alt="Project Collaboration" className="rounded-lg shadow-lg" />
                            </CarouselItem>
                            <CarouselItem>
                                <img src={image2} alt="Teamwork" className="rounded-lg shadow-lg" />
                            </CarouselItem>
                            <CarouselItem>
                                <img src={image3} alt="Freelancing" className="rounded-lg shadow-lg" />
                            </CarouselItem>
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </motion.div>
            </motion.div>
            {/* New Section: Large Image + Glassmorphic Text */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
                className="relative flex flex-col-reverse lg:flex-row items-center justify-between w-[90%] lg:w-[80%] mx-auto mt-16 lg:mt-20"
            >
                {/* Left: Reduced Image Size */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
                    className="w-full lg:w-[40%] mt-10 lg:mt-0"
                >
                    <img src={landing} alt="Work Collaboration" className="rounded-lg shadow-lg w-full max-w-xl mx-auto" />
                </motion.div>

                {/* Right: Glassmorphic Text Box */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 1 }}
                    className="relative z-10 bg-white/20 dark:bg-black/30 backdrop-blur-lg rounded-2xl shadow-lg p-8 w-full lg:w-[55%] text-left text-white"
                >
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-[1.3]">
                        Up your work game, it’s easy
                    </h2>
                    <ul className="mt-6 space-y-4 text-lg">
                        <li className="flex items-start space-x-3">
                            <CheckCircle className="text-[#0077B6] dark:text-[#00FFE5] w-6 h-6" />
                            <div>
                                <strong className="text-gray-900 dark:text-white">No cost to join</strong>
                                <h3 className="text-gray-800 dark:text-gray-300 text-sm">
                                    Register and browse talent profiles, explore projects.
                                </h3>
                            </div>
                        </li>
                        <li className="flex items-start space-x-3">
                            <Briefcase className="text-[#0077B6] dark:text-[#00FFE5] w-6 h-6" />
                            <div>
                                <strong className="text-gray-900 dark:text-white">Post a job and hire top talent</strong>
                                <h3 className="text-gray-800 dark:text-gray-300 text-sm">
                                    Finding talent is easy—post a job or let us search for you!
                                </h3>
                            </div>
                        </li>
                        <li className="flex items-start space-x-3">
                            <DollarSign className="text-[#0077B6] dark:text-[#00FFE5] w-6 h-6" />
                            <div>
                                <strong className="text-gray-900 dark:text-white">Work without breaking the bank</strong>
                                <h3 className="text-gray-800 dark:text-gray-300 text-sm">
                                    Makes it affordable to up your work.
                                </h3>
                            </div>
                        </li>
                    </ul>
                    <button className="mt-4 px-4 py-2 bg-[#0077B6] dark:bg-[#00FFE5] text-white dark:text-black font-semibold rounded-md shadow-md hover:bg-[#005F8C] dark:hover:bg-[#00BFA5] transition text-sm">
                        Get started
                    </button>

                </motion.div>
            </motion.div>
        </>
    )
};

export default Body