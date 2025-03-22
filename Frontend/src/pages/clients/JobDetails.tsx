import { jobDetails } from "@/api/client/jobApi";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoPricetagOutline } from "react-icons/io5";
import { SiLevelsdotfyi } from "react-icons/si";
import dayjs from "dayjs";
import Spinner from "@/components/ui/Spinner";
import { FileEdit } from "lucide-react";
import { JobType } from "@/types/Types";

const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState<JobType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await jobDetails(id!);
                setJob(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
                <Spinner />
            </div>
        );
    }

    if (!job) return <p>Job not found</p>;

    const handleEdit = () => {
        navigate(`/client/job/edit-job/${job?._id}`);
    };

    return (
        <div className="p-5 mt-16 max-w-6xl mx-auto">
            <div className="rounded-lg p-6 bg-white dark:bg-gray-950">
            <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">{job.title}</h1>
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 text-sm rounded-full ${
                            job.status === 'Open' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                            {job.status}
                        </span>
                        <button
                            onClick={handleEdit}
                            className="flex items-center gap-2 px-3 py-1 text-sm rounded-lg 
                            border border-gray-300 hover:border-gray-400 
                            dark:border-gray-700 dark:hover:border-gray-600
                            transition-colors duration-200"
                        >
                            <FileEdit className="w-4 h-4" />
                            <span>Edit Job</span>
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Client Info */}
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Posted by:</span>
                        <span className="ml-2">{job.clientId.name}</span>
                    </div>

                    {/* Main Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 py-4 border-y dark:border-gray-800">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <IoPricetagOutline className="mr-2 text-yellow-600" />
                            <span>Budget: ₹{job.rate}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <SiLevelsdotfyi className="mr-2 text-green-600" />
                            <span>{job.experienceLevel}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Location:</span>
                            <span className="ml-2">{job.location}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Category:</span>
                            <span className="ml-2">{job.category.name}</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <h2 className="text-lg font-semibold">Description</h2>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                            {job.description}
                        </p>
                    </div>

                    {/* Skills */}
                    <div className="space-y-2">
                        <h2 className="text-lg font-semibold">Required Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {job.skills.map((skill) => (
                                <span
                                    key={skill._id}
                                    className="px-3 py-1 text-xs border rounded-full bg-gray-200 dark:bg-gray-800 dark:text-white text-gray-700"
                                >
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-500 pt-4">
                        <p>Applications: {job.applicants}</p>
                        <p>Posted on: {dayjs(job.createdAt).format("DD MMM YYYY")}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetail;