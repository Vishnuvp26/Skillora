import { Eye, X } from "lucide-react";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { JobsListProps } from "@/types/Types";
import { IoPricetagOutline } from "react-icons/io5";
import { SiLevelsdotfyi } from "react-icons/si";
import { useNavigate } from "react-router-dom";

const JobsList = ({ jobs, visibleJobs, setVisibleJobs }: JobsListProps) => {
    const [expanded, setExpanded] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const descriptionLimit = 100;

    const filteredJobs = jobs.filter((job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const navigate = useNavigate();

    return (
        <div className="mt-10">
            {jobs.length > 0 ? (
                <div className="flex flex-col gap-5 mt-1.5">
                    <div className="flex justify-between items-center flex-wrap gap-3">
                        <h2 className="text-xl font-semibold">Your Jobs</h2>
                        <div className="w-full sm:w-72 md:w-96 lg:max-w-[600px] relative">
                            <input
                                type="text"
                                placeholder="Search jobs..."
                                className="w-full border p-2.5 pl-3 pr-8 rounded-lg text-sm dark:bg-gray-950 dark:text-white 
                                focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-600"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <X
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700"
                                    onClick={() => setSearchTerm("")}
                                />
                            )}
                        </div>
                    </div>

                    {filteredJobs.length > 0 ? (
                        filteredJobs.slice(0, visibleJobs).map((job) => (
                            <div
                                key={job._id}
                                className="border rounded-lg p-5 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-black transition duration-200"
                            >
                                <div className="flex justify-between items-center">
                                    <h5 className="font-semibold">{job.title}</h5>
                                    <Eye className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300" onClick={() => navigate(`/client/job/view-job/${job._id}`)}/>
                                </div>
                                <p className="flex items-center text-sm text-gray-500 mt-3">
                                    <IoPricetagOutline className="mr-2 text-yellow-600" />
                                    Budget: ₹{job.rate}
                                </p>
                                <p className="flex items-center text-sm text-gray-500 mt-1">
                                    <SiLevelsdotfyi className="mr-2 text-green-600" />
                                    {job.experienceLevel}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">Category: {job.category?.name}</p>
                                <p className="text-gray-900 dark:text-gray-300 text-sm mt-1">
                                    {expanded === job._id
                                        ? job.description
                                        : `${job.description.slice(0, descriptionLimit)}...`}
                                    {job.description.length > descriptionLimit && (
                                        <span
                                            className="text-blue-600 cursor-pointer ml-1 dark:text-cyan-500"
                                            onClick={() =>
                                                setExpanded(expanded === job._id ? null : job._id)
                                            }
                                        >
                                            {expanded === job._id ? "View Less" : "View More"}
                                        </span>
                                    )}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {job.skills.map((skill) => (
                                        <span
                                            key={skill._id}
                                            className="px-3 py-1 text-xs border rounded-full bg-gray-200 dark:bg-gray-800 dark:text-white text-gray-700"
                                        >
                                            {skill.name}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-sm mt-3 text-gray-500">
                                    Posted on: {dayjs(job.createdAt).format("DD MMM YYYY")}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 mt-4">No results found.</div>
                    )}

                    {visibleJobs < filteredJobs.length && (
                        <Button
                            onClick={() => setVisibleJobs((prev) => prev + 5)}
                            className="mt-4 bg-[#0077B6] hover:bg-[#005f8c] text-white px-4 py-2 rounded-lg 
                            dark:bg-transparent dark:border dark:border-[#00FFE5] dark:text-[#00FFE5] 
                            dark:hover:bg-[#00FFE511] self-center"
                        >
                            View More
                        </Button>
                    )}
                </div>
            ) : (
                <div className="p-10 mt-4 flex flex-col items-center text-center bg-white dark:bg-gray-950">
                    <p className="text-gray-600 mt-4">No job posts or contracts in progress right now</p>
                </div>
            )}
        </div>
    );
};

export default JobsList;