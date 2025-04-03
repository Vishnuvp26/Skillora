import { Eye, Users, X } from "lucide-react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { JobsListProps } from "@/types/Types";
import { IoPricetagOutline } from "react-icons/io5";
import { SiLevelsdotfyi } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { getApplicantStatus } from "@/api/freelancer/applyJobApi";

const JobsList = ({ jobs, visibleJobs, setVisibleJobs }: JobsListProps) => {
    const userRole = useSelector((state: RootState) => state.user.role);
    const userId = useSelector((state: RootState) => state.user._id);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState<"budget" | "date" | null>(null);
    const [filterExperience, setFilterExperience] = useState<string | null>(null);
    const [appliedJobs, setAppliedJobs] = useState<{ [key: string]: boolean }>({});
    const descriptionLimit = 100;

    const navigate = useNavigate();

    const filteredJobs = jobs
        .filter((job) =>
            job.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter((job) =>
            filterExperience ? job.experienceLevel === filterExperience : true
        );

    const sortedJobs = [...filteredJobs].sort((a, b) => {
        if (sortOption === "budget") {
            return b.rate - a.rate;
        } else if (sortOption === "date") {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0;
    });

    useEffect(() => {
        if (userRole === "freelancer") {
            const fetchAppliedStatus = async () => {
                try {
                    const appliedStatuses = await Promise.all(
                        sortedJobs.map(async (job) => {
                            const response = await getApplicantStatus(job._id, userId);
                            return { jobId: job._id, isApplied: response?.application?.isApplied };
                        })
                    );
                    const statusMap: { [key: string]: boolean } = {};
                    appliedStatuses.forEach(({ jobId, isApplied }) => {
                        statusMap[jobId] = isApplied;
                    });
                    setAppliedJobs(statusMap);
                } catch (error) {
                    console.error("Error checking applied status", error);
                }
            };
            fetchAppliedStatus();
        }
    }, [sortedJobs, userRole, userId]);

    return (
        <div className="mt-10">
            {jobs.length > 0 ? (
                <div className="flex flex-col gap-5 mt-1.5">
                    <div className="flex justify-between items-center flex-wrap gap-3">
                        {userRole === "client" ? (
                            <h2 className="text-xl font-semibold">Your Jobs</h2>
                        ) : (
                            <h2 className="text-xl font-semibold">Find Jobs</h2>
                        )}
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

                    {/* Sort and Filter Options */}
                    <div className="flex flex-wrap gap-4 mt-4">
                        <select
                            className="border p-2 rounded-lg text-sm dark:bg-gray-950 dark:text-white"
                            value={sortOption || ""}
                            onChange={(e) =>
                                setSortOption(
                                    e.target.value === "budget"
                                        ? "budget"
                                        : e.target.value === "date"
                                            ? "date"
                                            : null
                                )
                            }
                        >
                            <option value="">Sort By</option>
                            <option value="budget">Budget</option>
                            <option value="date">Posted Date</option>
                        </select>

                        <select
                            className="border p-2 rounded-lg text-sm dark:bg-gray-950 dark:text-white"
                            value={filterExperience || ""}
                            onChange={(e) =>
                                setFilterExperience(
                                    e.target.value || null
                                )
                            }
                        >
                            <option value="">Filter by Experience</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Expert">Expert</option>
                        </select>
                    </div>

                    {sortedJobs.length > 0 ? (
                        sortedJobs.slice(0, visibleJobs).map((job) => (
                            <div
                                key={job._id}
                                className="border rounded-lg p-5 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-black transition duration-200"
                            >
                                <div className="flex justify-between items-center">
                                    <h5 className="font-semibold">{job.title}</h5>

                                    <div className="flex items-center gap-3">
                                        {userRole === "client" && job.applicants > 0 && (
                                            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-300">
                                                <Users className="w-4 h-4" />
                                                <span className="text-sm font-medium">{job.applicants}</span>
                                            </div>
                                        )}
                                        {/* Applied Badge for Freelancer */}
                                        {userRole === "freelancer" && appliedJobs[job._id] && (
                                            <span className="text-xs px-2 py-1 bg-green-200 text-green-800 rounded-lg dark:bg-green-700 dark:text-white">
                                                Applied
                                            </span>
                                        )}

                                        <Eye
                                            className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                                            onClick={() =>
                                                navigate(
                                                    userRole === "client"
                                                        ? `/client/job/view-job/${job._id}`
                                                        : `/freelancer/job/view-job/${job._id}`
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                                <p className="flex items-center text-sm text-gray-700 dark:text-gray-400 mt-3">
                                    <IoPricetagOutline className="mr-2 text-yellow-600" />
                                    Budget: ₹{job.rate}
                                </p>
                                <p className="flex items-center text-sm text-gray-700 dark:text-gray-400 mt-1">
                                    <SiLevelsdotfyi className="mr-2 text-green-600" />
                                    {job.experienceLevel}
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-400 mt-1">Category: {job.category?.name}</p>
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
                                {job.skills && job.skills.length > 0 && (
                                    <div className="mt-3">
                                        <h6 className="text-sm font-semibold text-gray-700 dark:text-gray-400">Skills:</h6>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {job.skills.map((skill: { _id: string; name: string }) => (
                                                <span
                                                    key={skill._id}
                                                    className="px-2 py-1 text-xs bg-gray-200 text-gray-800 rounded-xl dark:bg-gray-800 dark:text-gray-200"
                                                >
                                                    {skill.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <p className="text-sm mt-3 text-gray-500">
                                    Posted on: {dayjs(job.createdAt).format("DD MMM YYYY")}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 mt-4">No results found.</div>
                    )}

                    {visibleJobs < sortedJobs.length && (
                        <p
                            onClick={() => setVisibleJobs((prev) => prev + 5)}
                            className="mt-4 text-blue-950 px-4 py-2 
                            dark:bg-transparent  dark:text-[#00FFE5] self-center"
                        >
                            View More
                        </p>
                    )}
                </div>
            ) : (
                <div className="p-10 mt-4 flex flex-col items-center text-center bg-white dark:bg-gray-950">
                    <p className="text-gray-700 dark:text-gray-400 mt-4">No job posts or contracts in progress right now</p>
                </div>
            )}
        </div>
    );
};

export default JobsList;