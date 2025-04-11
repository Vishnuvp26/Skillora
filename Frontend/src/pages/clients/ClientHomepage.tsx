import { fetchMyJobs } from "@/api/client/jobApi";
import { Button } from "@/components/ui/button";
import { RootState } from "@/redux/store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Job } from "@/types/Types";
import JobsList from "@/components/job/JobsList";
import Spinner from "@/components/ui/Spinner";

const ClientHomepage = () => {
    const userId = useSelector((state: RootState) => state.user._id);
    const userName = useSelector((state: RootState) => state.user.name);
    const navigate = useNavigate();

    const [jobs, setJobs] = useState<Job[]>([]);
    const [visibleJobs, setVisibleJobs] = useState(5);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getMyJobs = async () => {
            try {
                const response = await fetchMyJobs(userId);
                const sortedJobs = (response.jobs || []).sort(
                    (a: Job, b: Job) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setJobs(sortedJobs);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        getMyJobs();
    }, [userId]);
    
    return (
        <div className="min-h-screen dark:bg-gray-950 flex flex-col items-center">
            <div className="w-full max-w-6xl px-6 mt-6">
                <div className="flex justify-between items-center mt-20">
                <h1 className="text-xl sm:text-2xl font-semibold">
                        <span className="text-black dark:text-white">Welcome, </span>
                        <span className="text-[#0077B6] dark:bg-gradient-to-r dark:from-emerald-400 dark:to-cyan-400 dark:bg-clip-text dark:text-transparent">
                            {userName}
                        </span>
                    </h1>
                    <Button
                        onClick={() => navigate("/client/post-job")}
                        className="bg-[#0077B6] hover:bg-[#005f8c] text-white px-4 py-2 rounded-lg 
                        dark:bg-transparent dark:border dark:border-[#00FFE5] dark:text-[#00FFE5] 
                        dark:hover:bg-[#00FFE511] sm:text-base sm:px-5 sm:py-2.5"
                    >
                        + Post Work
                    </Button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center absolute inset-0">
                        <Spinner />
                    </div>
                
                ) : (
                    <JobsList
                        jobs={jobs}
                        visibleJobs={visibleJobs}
                        setVisibleJobs={setVisibleJobs}
                    />
                )}
            </div>
        </div>
    );
};

export default ClientHomepage;