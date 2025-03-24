import { motion } from "framer-motion";
import { FaFacebook, FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";

const Footer = () => {
    return (
        <motion.footer
            className="bg-gray-100 dark:bg-gray-900 py-10 mt-14"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }}
        >
            {/* Footer Content */}
            <div className="w-[90%] lg:w-[80%] mx-auto flex flex-col md:flex-row justify-between items-center md:items-start space-y-6 md:space-y-0 md:space-x-10 text-gray-900 dark:text-white">
                
                {/* Left Section */}
                <div className="text-center md:text-left">
                    <h3 className="text-md font-semibold">Help & Support</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer hover:underline">Blog</p>
                    
                    <h3 className="text-md font-semibold mt-4">Follow us on</h3>
                    <div className="flex justify-center md:justify-start space-x-4 mt-2">
                        <FaFacebook className="w-6 h-6 cursor-pointer hover:text-blue-600 transition" />
                        <FaInstagram className="w-6 h-6 cursor-pointer hover:text-pink-500 transition" />
                        <FaXTwitter className="w-6 h-6 cursor-pointer hover:text-blue-400 transition" />
                        <FaYoutube className="w-6 h-6 cursor-pointer hover:text-red-600 transition" />
                    </div>
                </div>

                {/* Middle Section */}
                <div className="text-center">
                    <h3 className="text-md font-semibold">About us</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer hover:underline">Feedback</p>
                </div>

                {/* Right Section */}
                <div className="text-center md:text-right">
                    <h3 className="text-md font-semibold">Contact us</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">skillora@company.com</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">+91 8853337201</p>
                </div>
            </div>

            {/* Horizontal Line */}
            <hr className="w-[90%] lg:w-[80%] mx-auto my-6 border-gray-300 dark:border-gray-700" />

            {/* Copyright Section */}
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                © 2025 Skillora. All rights reserved.
            </p>
        </motion.footer>
    );
};

export default Footer;