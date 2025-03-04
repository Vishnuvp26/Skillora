import { motion } from "framer-motion";

const categories = [
    "Web Development",
    "Graphic Design",
    "Content Writing",
    "Digital Marketing",
    "App Development",
    "UI/UX Design",
    "Video Editing",
    "Data Science"
];

const BrowseCategories = () => {
    return (
        <section className="w-[90%] lg:w-[80%] mx-auto mt-16">
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
                        className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 rounded-xl text-center shadow-sm transition-all"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {category}
                        </h3>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
};

export default BrowseCategories