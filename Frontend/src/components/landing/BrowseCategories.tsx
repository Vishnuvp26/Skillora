import { motion } from "framer-motion";
import { Code, Paintbrush, FileText, Megaphone, Smartphone, PenTool, Video, BarChart } from "lucide-react";

const categories = [
    { name: "Web Development", icon: <Code className="w-6 h-6 text-blue-500 dark:text-blue-400" /> },
    { name: "Graphic Design", icon: <Paintbrush className="w-6 h-6 text-pink-500 dark:text-pink-400" /> },
    { name: "Content Writing", icon: <FileText className="w-6 h-6 text-green-500 dark:text-green-400" /> },
    { name: "Digital Marketing", icon: <Megaphone className="w-6 h-6 text-yellow-500 dark:text-yellow-400" /> },
    { name: "App Development", icon: <Smartphone className="w-6 h-6 text-purple-500 dark:text-purple-400" /> },
    { name: "UI/UX Design", icon: <PenTool className="w-6 h-6 text-teal-500 dark:text-teal-400" /> },
    { name: "Video Editing", icon: <Video className="w-6 h-6 text-red-500 dark:text-red-400" /> },
    { name: "Data Science", icon: <BarChart className="w-6 h-6 text-indigo-500 dark:text-indigo-400" /> },
];

const BrowseCategories = () => {
    return (
        <section className="w-[90%] lg:w-[80%] mx-auto mt-14 lg:mt-24">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white text-center mb-10">
                Browse Talent by Category
            </h2>

            <motion.div
                className="grid grid-cols-2 lg:grid-cols-4 gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
                }}
            >
                {categories.map((category, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)" }}
                        className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 rounded-xl text-center shadow-sm flex flex-col items-center justify-center transition-all"
                    >
                        {category.icon}
                        <h3 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">
                            {category.name}
                        </h3>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
};

export default BrowseCategories;