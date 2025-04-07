import { Clock, Play, Hammer, CheckCircle } from "lucide-react";

interface ProgressBarProps {
    workStatus: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ workStatus }) => {
    const getProgressWidth = () => {
        switch (workStatus) {
            case "Pending":
                return "25%";
            case "Started":
                return "50%";
            case "Ongoing":
                return "75%";
            case "Completed":
                return "100%";
            default:
                return "0%";
        }
    };

    return (
        <div className="space-y-4 pt-10">
            <div className="flex justify-between items-center text-sm font-medium text-gray-600 dark:text-gray-400">
                <div className="flex flex-col items-center">
                    <Clock className={`w-5 h-5 ${workStatus === "Pending" ? "text-blue-500" : "text-gray-400"}`} />
                    <span>Pending</span>
                </div>
                <div className="flex flex-col items-center">
                    <Play className={`w-5 h-5 ${workStatus === "Started" ? "text-blue-500" : "text-gray-400"}`} />
                    <span>Started</span>
                </div>
                <div className="flex flex-col items-center">
                    <Hammer className={`w-5 h-5 ${workStatus === "Ongoing" ? "text-blue-500" : "text-gray-400"}`} />
                    <span>Ongoing</span>
                </div>
                <div className="flex flex-col items-center">
                    <CheckCircle className={`w-5 h-5 ${workStatus === "Completed" ? "text-blue-500" : "text-gray-400"}`} />
                    <span>Completed</span>
                </div>
            </div>
            <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                    className={`absolute h-2.5 rounded-full bg-blue-600 dark:bg-blue-400 transition-all`}
                    style={{ width: getProgressWidth() }}
                ></div>
            </div>
        </div>
    );
};

export default ProgressBar;