import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cancelApplication, viewAppliedJobs } from "@/api/freelancer/applyJobApi";
import Spinner from "@/components/ui/Spinner";
import { Eye, X, XCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Application } from "@/types/Types";
import toast from "react-hot-toast";

const AppliedJobs = () => {
    const userId = useSelector((state: RootState) => state.user._id);
    const [applications, setApplications] = useState<Application[]>([]);
    const [visibleJobs, setVisibleJobs] = useState(5);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [openDialog, setOpenDialog] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await viewAppliedJobs(userId);
                const sortedJobs = (response.applications || []).sort(
                    (a: Application, b: Application) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setApplications(sortedJobs);
            } catch (error) {
                console.error("Failed to fetch applications:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [userId]);

    const filteredApplications = applications.filter((application) =>
        application.jobId?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const cancelJobApplication = async (applicationId: string) => {
        try {
            await cancelApplication(applicationId, userId);
            setApplications((prev) =>
                prev.filter((application) => application._id !== applicationId)
            );
            toast.success("Job application canceled successfully!");
        } catch (error) {
            console.error("Failed to cancel job application:", error);
        } finally {
            setOpenDialog(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen dark:bg-gray-950 flex flex-col items-center mt-20">
            <div className="w-full max-w-6xl px-6 mt-10">
                <div className="flex justify-between items-center flex-wrap gap-3">
                    <h2 className="text-xl font-semibold mt-2">Applied Jobs</h2>
                    <div className="w-full sm:w-72 md:w-96 lg:max-w-[600px] relative">
                        <input
                            type="text"
                            placeholder="Search applied jobs..."
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

                {filteredApplications.length > 0 ? (
                    <div className="flex flex-col gap-5 mt-9">
                        {filteredApplications.slice(0, visibleJobs).map((application) => (
                            <div
                                key={application._id}
                                className="border rounded-lg p-5 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-black transition duration-200"
                            >
                                <div className="flex justify-between items-center">
                                    <h5 className="font-semibold">{application.jobId.title}</h5>
                                    <TooltipProvider>
                                        <div className="flex items-center gap-3">
                                            <Eye
                                                onClick={() =>
                                                    navigate(`/freelancer/job/view-job/${application.jobId._id}`)
                                                }
                                                className="text-gray-500 cursor-pointer hover:text-gray-900 dark:hover:text-gray-300 w-5 h-5"
                                            />
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <XCircle
                                                        className="text-red-500 cursor-pointer hover:text-red-600 w-5 h-5"
                                                        onClick={() => setOpenDialog(application._id)}
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Cancel Application</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <Dialog open={openDialog === application._id} onOpenChange={(open) => !open && setOpenDialog(null)}>
                                                <DialogContent className="max-w-[90%] sm:max-w-md rounded-lg p-6">
                                                    <DialogHeader>
                                                        <DialogTitle className="text-lg font-semibold">Cancel Application</DialogTitle>
                                                        <DialogDescription>
                                                            Are you sure you want to cancel this application? This action cannot be undone.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter className="flex flex-col sm:flex-row justify-between mt-4 sm:space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            className="w-full sm:w-auto mb-2 sm:mb-0"
                                                            onClick={() => setOpenDialog(null)}
                                                        >
                                                            No, Keep It
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            className="w-full sm:w-auto"
                                                            onClick={() => cancelJobApplication(application._id)}
                                                        >
                                                            Yes, Cancel
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </TooltipProvider>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-400 mt-1">
                                    {application.jobId.description.slice(0, 100)}...
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-400 mt-1">
                                    Budget: ₹{application.jobId.rate}
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-400 mt-1">
                                    Experience Level: {application.jobId.experienceLevel}
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-400 mt-1">
                                    Status: {application.status}
                                </p>
                            </div>
                        ))}
                        {visibleJobs < filteredApplications.length && (
                            <Button
                                onClick={() => setVisibleJobs((prev) => prev + 5)}
                                className="mt-4 bg-[#0077B6] hover:bg-[#005f8c] text-white px-4 py-2 rounded-lg"
                            >
                                View More
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="p-10 mt-4 flex flex-col items-center text-center bg-white dark:bg-gray-950">
                        <p className="text-gray-700 dark:text-gray-400 mt-4">No applications found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppliedJobs;