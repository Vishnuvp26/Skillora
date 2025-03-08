import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
            <motion.h1
                className="text-6xl font-bold text-blue-900"
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
                    className="mt-6 px-6 py-3 text-lg"
                >
                    Go Back
                </Button>
            </motion.div>
        </div>
    );
};

export default NotFound;