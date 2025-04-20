import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import missionBackground from "@/assets/mission.webp"
import visionBackground from "@/assets/vision.webp"
import { motion } from "framer-motion";

const About = () => {
    const navigate = useNavigate()
    return (
        <>
            <Navbar />
            <div className="min-h-screen dark:bg-gray-950 bg-white text-gray-800 dark:text-white flex flex-col items-center">
                <div className="w-full max-w-7xl px-6 py-12 space-y-16">
                    
                    {/* Hero Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="relative w-full flex items-center justify-center py-16 mb-16"
                    >
                        {/* Content */}
                        <div className="text-center space-y-6 px-4">
                            <h1 className="text-4xl font-bold md:text-5xl dark:text-white text-gray-900">
                                About Us
                            </h1>
                            <p className="text-lg md:text-xl max-w-3xl mx-auto dark:text-gray-400 text-gray-600">
                                Empowering freelancers and clients with a smart, secure, and scalable platform 
                                to collaborate and grow together.
                            </p>
                        </div>
                    </motion.section>

                    {/* Mission and Vision */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="space-y-12"
                    >
                        {/* Mission Section */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col md:flex-row gap-8 items-center"
                        >
                            <div className="w-full md:w-1/2">
                                <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                                <p className="text-lg">
                                    At Skillora, our mission is to create a thriving ecosystem where talented freelancers can connect with clients seamlessly. We aim to streamline collaboration with intuitive tools, ensuring transparency and growth.
                                </p>
                            </div>
                            <div className="w-full md:w-1/2 h-[300px] relative rounded-xl overflow-hidden">
                                <img 
                                    src={missionBackground} 
                                    alt="Our Mission" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </motion.div>

                        {/* Vision Section */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="flex flex-col md:flex-row-reverse gap-8 items-center"
                        >
                            <div className="w-full md:w-1/2">
                                <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
                                <p className="text-lg">
                                    We envision a future where remote work is accessible to everyone. By leveraging the power of technology, Skillora is building a global platform that fosters trust, quality, and opportunity.
                                </p>
                            </div>
                            <div className="w-full md:w-1/2 h-[300px] relative rounded-xl overflow-hidden">
                                <img 
                                    src={visionBackground} 
                                    alt="Our Vision" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </motion.div>
                    </motion.section>

                    {/* Team or Core Values Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <h2 className="text-3xl font-bold text-center mb-10">What Makes Us Unique</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <Card className="rounded-2xl shadow-md">
                                <CardContent className="p-6 space-y-3">
                                    <h3 className="text-xl font-semibold">Verified Freelancers</h3>
                                    <p>
                                        We ensure quality by verifying freelancer profiles, skills, and work history.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="rounded-2xl shadow-md">
                                <CardContent className="p-6 space-y-3">
                                    <h3 className="text-xl font-semibold">Secure Contracts</h3>
                                    <p>
                                        All projects are protected through escrow-based contracts for peace of mind.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="rounded-2xl shadow-md">
                                <CardContent className="p-6 space-y-3">
                                    <h3 className="text-xl font-semibold">Real-time Collaboration</h3>
                                    <p>
                                        With chat, notifications, and live updates, Skillora keeps teams connected and productive.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.section>
                    {/* Call to Action */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                        className="text-center space-y-4"
                    >
                        <h2 className="text-2xl font-bold">Join the Skillora Revolution</h2>
                        <p>
                            Whether you're a freelancer looking for exciting projects or a client in search of talent, Skillora is your home.
                        </p>
                        <Button onClick={() => navigate('/')} size="lg" className="rounded-xl">
                            Get Started <ArrowRight className="w-4 h-4" />
                        </Button>
                    </motion.section>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default About;