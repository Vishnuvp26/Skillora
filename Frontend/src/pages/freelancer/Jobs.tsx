import { fetchAllJobs } from "@/api/client/jobApi";
import JobsList from "@/components/job/JobsList";
import Spinner from "@/components/ui/Spinner";
import { Job } from "@/types/Types";
import { useEffect, useState } from "react";

const Jobs = () => {

    const [jobs, setJobs] = useState<Job[]>([]);
    const [visibleJobs, setVisibleJobs] = useState(5);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getMyJobs = async () => {
            try {
                const response = await fetchAllJobs();
                setJobs(response.jobs || []);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        getMyJobs();
    }, []);

    return (
        <div className="min-h-screen dark:bg-gray-950 flex flex-col items-center mt-14">
            <div className="w-full max-w-6xl px-6 mt-6">
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
    )
};

export default Jobs;