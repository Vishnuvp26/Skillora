import { ShieldCheck, DollarSign, ThumbsUp, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";

const reasons = [
    {
        icon: <DollarSign className="w-10 h-10 text-blue-500" />,
        title: "Value", text: "We have the lowest fees in the industry, providing you with maximum value at minimum cost."
    },
    {
        icon: <ShieldCheck className="w-10 h-10 text-green-500" />,
        title: "Security", text: "We offer SafePay payment protection and your choice of preferred payment method."
    },
    {
        icon: <ThumbsUp className="w-10 h-10 text-yellow-500" />,
        title: "Credibility", text: "Our platform is trusted by thousands of freelancers and businesses worldwide."
    },
    {
        icon: <RefreshCcw className="w-10 h-10 text-purple-500" />,
        title: "Flexibility", text: "Work on your own terms, set your schedule, and choose projects that fit your skills."
    },
];

const WhyChooseUs = () => {
    return (
        <section className="w-[90%] lg:w-[80%] mx-auto mt-14 lg:mt-24 text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-10">
                Why People Choose Us
            </h2>
            
            <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                initial="hidden" 
                animate="visible" 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}
            >
                {reasons.map((reason, index) => (
                    <motion.div
                        key={index}
                        className=" border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow-sm flex flex-col items-center text-center transition-all"
                    >
                        {reason.icon}
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-4">{reason.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">{reason.text}</p>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
};

export default WhyChooseUs;