import FreelancerNav from "@/components/freelancer/FreelancerNav";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { TfiPencil } from "react-icons/tfi";
import { SiGithub } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa6";
import { LuGlobe } from "react-icons/lu";
import { IoLocationOutline } from "react-icons/io5";
import pic1 from '../../assets/portfolio1.png'
import pic2 from '../../assets/portfolio2.png'
import avatar from '../../assets/avatar.jpg'
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";

const projects = [
    { id: 1, src: pic1, title: "Ecommerce" },
    { id: 2, src: pic2, title: "Booking" },
];

const FreelancerProfile = () => {
    
    const userName = useSelector((state: RootState) => state.user.name);
    const userEmail = useSelector((state: RootState) => state.user.email);

    return (
        <div className="min-h-screen dark:bg-gray-950 flex justify-center p-6">
            <FreelancerNav />
            <div className="w-full max-w-6xl bg-white dark:bg-gray-950 rounded-xl border border-gray-300 dark:border-gray-800 p-8 mt-16">
                {/* SECTION 1 */}
                <div className="relative flex flex-col md:flex-row justify-between items-center md:items-start">
                    {/* Mobile: Move Edit Button to Top-Right */}
                    <Button className="absolute top-0 right-0 sm:hidden bg-[#0077B6] dark:bg-gray-900 dark:text-white">
                        Edit Profile
                    </Button>

                    <div className="flex items-center gap-6">
                        {/* Profile Picture */}
                        <div className="relative">
                            <img
                                src={avatar}
                                alt="Profile"
                                className="w-28 h-28 rounded-full border border-gray-300 dark:border-gray-700 object-cover"
                            />
                            <Dialog>
                                <DialogTrigger>
                                    <TfiPencil className="absolute bottom-2 right-2 p-1 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer w-8 h-8 border border-gray-300 dark:border-gray-600 shadow-md" />
                                </DialogTrigger>
                                <DialogContent>
                                    <p className="text-center text-black dark:text-white">Edit Profile Picture</p>
                                </DialogContent>
                            </Dialog>
                        </div>

                        {/* Name & Location */}
                        <div>
                            <h2 className="text-3xl font-bold text-black dark:bg-gradient-to-r dark:from-emerald-400 dark:to-cyan-400 dark:bg-clip-text dark:text-transparent">
                                {userName}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                <IoLocationOutline className="text-xl" /> New York, USA
                            </p>
                        </div>
                    </div>

                    {/* Default Button for Larger Screens */}
                    <Button className="mt-4 md:mt-0 hidden sm:block bg-[#0077B6] dark:bg-gray-900 dark:text-white">
                        Edit Profile
                    </Button>
                </div>


                <hr className="my-6 border-gray-300 dark:border-gray-900" />

                {/* FLEX GRID WITH VERTICAL LINE */}
                <div className="grid grid-cols-1 md:grid-cols-[0.8fr_auto_1.6fr] gap-6">
                    {/* Left Side - Personal Info */}
                    <div className="space-y-7 text-black dark:text-white">
                        <div>
                            <h3 className="font-semibold font-sans">Email</h3>
                            <p className="text-gray-600 dark:text-gray-400">{userEmail}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold font-sans">Education</h3>
                            <p className="text-gray-600 dark:text-gray-400">Oxford University, BA Physics</p>
                        </div>
                        <div>
                            <h3 className="font-semibold font-sans">Experience Level</h3>
                            <p className="text-gray-600 dark:text-gray-400">Intermediate</p>
                        </div>
                        <div>
                            <h3 className="font-semibold font-sans">Languages</h3>
                            <p className="text-gray-600 dark:text-gray-400">English</p>
                            <p className="text-gray-600 dark:text-gray-400">Hindi</p>
                            <p className="text-gray-600 dark:text-gray-400">Malayalam</p>
                        </div>
                        <div>
                            <h3 className="font-semibold font-sans">Linked Accounts</h3>
                            <div className="flex flex-col gap-3 mt-2">
                                <Button variant="outline" className="w-48 flex items-center justify-center gap-2">
                                    <SiGithub className="w-6 h-6" />
                                    GitHub
                                </Button>
                                <Button variant="outline" className="w-48 flex items-center justify-center gap-2">
                                    <FaLinkedin className="w-6 h-6" />
                                    LinkedIn
                                </Button>
                                <Button variant="outline" className="w-48 flex items-center justify-center gap-2">
                                    <LuGlobe className="w-6 h-6" />
                                    Website
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="w-px bg-gray-300 dark:bg-gray-900"></div>

                    {/* Right Side - Summary, Portfolio, and Skills */}
                    <div>
                        <h2 className="text-2xl font-bold text-black dark:text-white">
                            Full Stack Web Developer | Expertise in React, Node, MongoDB, Express
                        </h2>
                        <p className="mt-8 text-gray-600 dark:text-gray-400">
                            Passionate about building scalable web applications and creating seamless user experiences.
                            Experienced in front-end and back-end development, database design, and cloud deployment.
                        </p>
                        <hr className="my-6 border-gray-300 dark:border-gray-900" />
                        {/* PORTFOLIO */}
                        <h2 className="text-xl font-bold text-black dark:text-white mt-10">Portfolio</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                            {projects.map((project) => (
                                <Dialog key={project.id}>
                                    <DialogTrigger className="p-4 rounded-lg text-center cursor-pointer">
                                        <div className="text-left">
                                            <img
                                                src={project.src}
                                                alt={project.title}
                                                className="w-full h-32 object-cover rounded-md transition-transform duration-300 hover:brightness-50 hover:shadow-lg hover:scale-105"
                                            />
                                            <p className="mt-2 text-[#0077B6] dark:bg-gradient-to-r dark:from-emerald-400 dark:to-cyan-400 dark:bg-clip-text dark:text-transparent">
                                                {project.title}
                                            </p>
                                        </div>
                                    </DialogTrigger>
                                    <DialogContent className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-lg max-w-[90vw] sm:max-w-lg max-h-[90vh] overflow-y-auto">
                                        <img src={project.src} alt={project.title} className="w-full h-auto rounded-md" />
                                        <div className="mt-4 flex items-center justify-between">
                                            <p className="mt-2 text-[#0077B6] dark:bg-gradient-to-r dark:from-emerald-400 dark:to-cyan-400 dark:bg-clip-text dark:text-transparent">
                                                {project.title}
                                            </p>
                                            <a href="http://" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition text-sm">View</a>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            ))}
                        </div>

                        {/* SKILLS */}
                        <hr className="my-6 border-gray-300 dark:border-gray-900" />
                        <h2 className="text-xl font-bold text-black dark:text-white mt-6">Skills</h2>
                        <div className="flex flex-wrap gap-4 mt-3">
                            {["JavaScript", "React", "Node.js", "MongoDB", "Express.js", "Next.js", "Tailwind CSS", "TypeScript", "Firebase", "GraphQL"].map(skill => (
                                <div key={skill} className="bg-gray-200 dark:bg-gray-800 px-4 py-2 rounded-3xl text-black dark:text-white font-semibold text-sm">
                                    {skill}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <hr className="my-6 border-gray-300 dark:border-gray-900" />
                {/* EMPLOYMENT HISTORY */}
                <div>
                    <h2 className="text-2xl font-bold text-black dark:text-white">Employment History</h2>
                    <div className="space-y-6 mt-4 text-black dark:text-white">
                        <div>
                            <h3 className="font-semibold font-sans">Google</h3>
                            <p className="text-gray-600 dark:text-gray-400">Software Engineer</p>
                            <p className="text-gray-600 dark:text-gray-400">Jan 2020 - Present</p>
                        </div>
                        <hr className="border-gray-300 dark:border-gray-900" />
                        <div>
                            <h3 className="font-semibold font-sans">Microsoft</h3>
                            <p className="text-gray-600 dark:text-gray-400">Frontend Developer</p>
                            <p className="text-gray-600 dark:text-gray-400">Aug 2018 - Dec 2019</p>
                        </div>
                        <hr className="border-gray-300 dark:border-gray-900" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FreelancerProfile;