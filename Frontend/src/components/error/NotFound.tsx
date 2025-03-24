import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-white dark:bg-gray-950 text-center">
            <motion.h1
                className="text-6xl font-bold text-[#ac1d1d] dark:bg-gradient-to-r dark:from-emerald-400 dark:to-cyan-400 dark:bg-clip-text dark:text-transparent"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                ERROR 404
            </motion.h1>
            <motion.p
                className="text-lg text-gray-600 mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                The page you're looking for doesn't exist.
            </motion.p>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
            >
                <Button
                    onClick={() => navigate(-1)}
                    className="mt-6 px-6 py-3 text-lg border border-[#000000] text-[#000000] bg-transparent 
                    hover:bg-[#0077B611] hover:text-[#000000] 
                    dark:border-[#00FFE5] dark:text-[#00FFE5] dark:hover:bg-[#00ffe53c] dark:hover:text-[#00FFE5]"
                >
                    Go Back
                </Button>
            </motion.div>
        </div>
    );
};

export default NotFound;