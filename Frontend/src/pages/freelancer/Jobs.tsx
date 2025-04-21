import JobsList from "@/components/job/JobsList";

const Jobs = () => {
    return (
        <div className="min-h-screen dark:bg-gray-950 flex flex-col items-center mt-14">
            <div className="w-full max-w-6xl px-6 mt-6">
                <JobsList />
            </div>
        </div>
    )
};

export default Jobs;