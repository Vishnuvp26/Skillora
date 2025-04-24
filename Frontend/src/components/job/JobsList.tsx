import { ChevronDown, Eye, Users, X } from "lucide-react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Job } from "@/types/Types";
import { IoPricetagOutline } from "react-icons/io5";
import { SiLevelsdotfyi } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { getApplicantStatus } from "@/api/freelancer/applyJobApi";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "../ui/button";
import { fetchAllJobs, fetchMyJobs } from "@/api/client/jobApi";
import Spinner from "../ui/Spinner";

const JobsList = () => {
    const userRole = useSelector((state: RootState) => state.user.role);
    const userId = useSelector((state: RootState) => state.user._id);

    const [jobs, setJobs] = useState<Job[]>([]);
    const [visibleJobs, setVisibleJobs] = useState(4);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState<"budgetHigh" | "budgetLow" | "dateNew" | "dateOld" | null>(null);
    const [filterExperience, setFilterExperience] = useState<string | null>(null);
    const [appliedJobs, setAppliedJobs] = useState<{ [key: string]: boolean }>({});
    const descriptionLimit = 100;

    const navigate = useNavigate();

    useEffect(() => {
        const getMyJobs = async () => {
            try {
                if (userRole === "client") {
                    const response = await fetchMyJobs(userId);
                    const sortedJobs = (response.jobs || []).sort(
                        (a: Job, b: Job) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    );
                    setJobs(sortedJobs);
                } else {
                    const response = await fetchAllJobs();
                    setJobs(response.jobs || []);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        getMyJobs();
    }, [userRole, userId]);

    const filteredJobs = jobs
        .filter((job) =>
            job.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter((job) =>
            filterExperience ? job.experienceLevel === filterExperience : true
        );

    const sortedJobs = [...filteredJobs].sort((a, b) => {
        switch (sortOption) {
            case "budgetHigh":
                return b.rate - a.rate;
            case "budgetLow":
                return a.rate - b.rate;
            case "dateNew":
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case "dateOld":
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            default:
                return 0;
        }
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

    if (loading) {
        return (
            <div className="flex justify-center items-center absolute inset-0">
                <Spinner />
            </div>
        );
    }
    
    return (
        <div className="mt-10">
            {jobs.length > 0 ? (
                <div className="flex flex-col gap-5 mt-1.5">
                    <div className="flex justify-between items-center flex-wrap gap-3">
                        {userRole === "client" ? (
                            <h2 className="text-xl font-semibold">Your Works</h2>
                        ) : (
                            <h2 className="text-xl font-semibold">Find Works</h2>
                        )}
                        <div className="w-full sm:w-72 md:w-96 lg:max-w-[600px] relative">
                            <input
                                type="text"
                                placeholder="Search works..."
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
                        <Select
                            value={sortOption ?? "sort"}
                            onValueChange={(value) => {
                                setSortOption(value === "clear" ? null : value as "budgetHigh" | "budgetLow" | "dateNew" | "dateOld");
                            }}
                        >
                            <SelectTrigger className="w-[180px] text-sm dark:bg-gray-950 dark:text-white">
                                <SelectValue placeholder="Sort By" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sort" disabled>Sort By</SelectItem>
                                <SelectItem value="budgetHigh">Budget: High to Low</SelectItem>
                                <SelectItem value="budgetLow">Budget: Low to High</SelectItem>
                                <SelectItem value="dateNew">Date: Newest First</SelectItem>
                                <SelectItem value="dateOld">Date: Oldest First</SelectItem>

                                <SelectItem value="clear">Clear Sort</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Experience Filter Select */}
                        <Select
                            value={filterExperience ?? "experience"}
                            onValueChange={(value) =>
                                setFilterExperience(value === "experience" || value === "clear" ? null : value)
                            }
                        >
                            <SelectTrigger className="w-[200px] text-sm dark:bg-gray-950 dark:text-white">
                                <SelectValue placeholder="Filter by Experience" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="experience" disabled>Filter by Experience</SelectItem>
                                <SelectItem value="Beginner">Beginner</SelectItem>
                                <SelectItem value="Intermediate">Intermediate</SelectItem>
                                <SelectItem value="Expert">Expert</SelectItem>
                                <SelectItem value="clear">Clear Filter</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {sortedJobs.length > 0 ? (
                        sortedJobs.slice(0, visibleJobs).map((job) => (
                            <div
                                key={job._id}
                                className="border rounded-lg p-5 bg-gray-100 dark:bg-gray-900 hover:bg-white dark:hover:bg-gray-950 transition duration-200"
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
                            className="mt-4 text-blue-950 px-4 py-2 flex items-center gap-2
                            dark:bg-transparent dark:text-[#00FFE5] self-center cursor-pointer"
                        >
                            View More
                            <ChevronDown className="w-4 h-4" />
                        </p>
                    )}
                </div>
            ) : (
                <div className="px-6 py-16 sm:p-24 mt-10 flex flex-col items-center text-center bg-white dark:bg-gray-950 rounded-xl shadow-sm">
                    <p className="text-lg sm:text-xl font-medium text-gray-800 dark:text-gray-200">
                        No Work Posts Yet
                    </p>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
                        You haven’t posted any jobs yet. Start by creating your first one!
                    </p>

                    <Button
                        onClick={() => navigate("/client/post-job")}
                        className="mt-6 px-5 py-2 sm:px-6 sm:py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 dark:from-purple-500 dark:to-indigo-500 rounded-full transition-all"
                    >
                        Get Started
                    </Button>
                </div>
            )}
        </div>
    );
};

export default JobsList;