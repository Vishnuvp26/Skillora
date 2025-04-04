import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
    return (
        <>
            <Navbar />
            <div className="min-h-screen dark:bg-gray-950 bg-white text-gray-800 dark:text-white flex flex-col items-center mt-16">
                <div className="w-full max-w-6xl px-6 py-12 space-y-16">
          
                    {/* Hero Section */}
                    <section className="text-center space-y-4">
                        <h1 className="text-4xl font-bold md:text-5xl">About Skillora</h1>
                        <p className="text-lg md:text-xl max-w-3xl mx-auto">
                            Empowering freelancers and clients with a smart, secure, and scalable platform to collaborate and grow together.
                        </p>
                    </section>

                    {/* Mission and Vision */}
                    <section className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                            <p>
                                At Skillora, our mission is to create a thriving ecosystem where talented freelancers can connect with clients seamlessly. We aim to streamline collaboration with intuitive tools, ensuring transparency and growth.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
                            <p>
                                We envision a future where remote work is accessible to everyone. By leveraging the power of technology, Skillora is building a global platform that fosters trust, quality, and opportunity.
                            </p>
                        </div>
                    </section>

                    {/* Team or Core Values Section */}
                    <section>
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
                    </section>

                    {/* Call to Action */}
                    <section className="text-center space-y-4">
                        <h2 className="text-2xl font-bold">Join the Skillora Revolution</h2>
                        <p>
                            Whether you're a freelancer looking for exciting projects or a client in search of talent, Skillora is your home.
                        </p>
                        <Button size="lg" className="rounded-xl">
                            Get Started
                        </Button>
                    </section>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default About;