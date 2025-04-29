import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const NoJobsPosted = () => {
    const navigate = useNavigate();
    return (
        <div className="px-6 py-16 sm:p-24 mt-10 flex flex-col items-center text-center bg-white dark:bg-gray-950 rounded-xl shadow-sm">
            <p className="text-lg sm:text-xl font-medium text-gray-800 dark:text-gray-200">
                No Work Posts Yet
            </p>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
                You haven't posted any jobs yet. Start by creating your first one!
            </p>
            <Button
                onClick={() => navigate("/client/post-job")}
                className="mt-6 px-5 py-2 sm:px-6 sm:py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 dark:from-purple-500 dark:to-indigo-500 rounded-full transition-all"
            >
                Get Started
            </Button>
        </div>
    )
};

export default NoJobsPosted;