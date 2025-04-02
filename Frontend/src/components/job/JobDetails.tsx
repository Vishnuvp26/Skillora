import { jobDetails, showApplicants } from "@/api/client/jobApi";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoPricetagOutline } from "react-icons/io5";
import { SiLevelsdotfyi } from "react-icons/si";
import dayjs from "dayjs";
import Spinner from "@/components/ui/Spinner";
import { Bookmark, BriefcaseBusiness, CircleCheck, FileEdit, Hourglass, XCircle } from "lucide-react";
import { IContract, JobType } from "@/types/Types";    
import { RootState } from "@/redux/store/store";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { applyJob, getApplicantStatus } from "@/api/freelancer/applyJobApi";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { createContract, deleteContract, isContractCreated } from "@/api/client/contractApi";

const JobDetail = () => {
    const userRole = useSelector((state: RootState) => state.user.role)
    const userId = useSelector((state: RootState) => state.user._id);

    const { id } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState<JobType | null>(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [applicants, setApplicants] = useState<any[]>([]);
    const [isApplied, setIsApplied] = useState<boolean>(false);
    const [contract, setContract] = useState<IContract | null>(null);
    const [contractedFreelancer, setContractedFreelancer] = useState<string | null>(null);
    const [contractId, setContractId] = useState(null);
    const [contractUpdated, setContractUpdated] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [actionType, setActionType] = useState<"make" | "cancel" | null>(null);
    const [selectedFreelancer, setSelectedFreelancer] = useState<string | null>(null);

    //Job details
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

    // Button state after job applied
    useEffect(() => {
        if (!id || !userId) return;
        const appliedStatus = async () => {
            try {
                const appliedStatus = await getApplicantStatus(id, userId);
                if (appliedStatus?.application?.isApplied) {
                    setIsApplied(appliedStatus?.application?.isApplied);
                }
            } catch (error: any) {
                console.log('Error checking applied status', error);
            }
        }
        appliedStatus()
    }, [id]);

    // Show applied freelancers
    useEffect(() => {
        if (userRole === "client" && id && userId) {
            const fetchApplicants = async () => {
                try {
                    const response = await showApplicants(id, userId);
                    setApplicants(response.applicants);
                } catch (error) {
                    console.error("Error fetching applicants:", error);
                }
            };
            fetchApplicants();
        }
    }, [userRole, id, userId]);

    // Button state for contract created
    useEffect(() => {
        if (!id || !userId) return;
    
        const fetchContract = async () => {
            try {
                const response = await isContractCreated(id, userId);
                if (response.contract) {
                    setContract(response.contract);
                    setContractId(response.contract._id);
                    setContractedFreelancer(response.contract.freelancerId);
                } else {
                    setContract(null);
                    setContractId(null);
                    setContractedFreelancer(null);
                }
            } catch (error: any) {
                console.error("Error fetching contract:", error);
            }
        };
    
        fetchContract();
    }, [id, userId, contractUpdated]);

    console.log('CONTRACT FROM useEffect..', contract);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
                <Spinner />
            </div>
        );
    };
    if (!job) return <p>Job not found</p>;

    // Edit job route
    const handleEdit = () => {
        navigate(`/client/job/edit-job/${job?._id}`);
    };

    // Apply job
    const handleApplyJob = async () => {
        if (!job || !id) return;
        if (userRole !== "freelancer") {
            toast.error("Only freelancers can apply for jobs.");
            return;
        }

        try {
            const response = await applyJob(id, userId);
            console.log('APPLY JOB RESPONSE', response);
            toast.success(response.message);
            setIsApplied(true);
            setOpen(false);
        } catch (error: any) {
            console.error("Error applying for job:", error);
            toast.error(error.error);
        }
    };

    // Create contract
    const makeContract = async (freelancerId: string) => {
        try {
            if (!id || !userId || !freelancerId) return;
            const response = await createContract(id, userId, { freelancerId, amount: job.rate });
            toast.success(response.message);
            setContractUpdated(prev => !prev);
        } catch (error: any) {
            toast.error(error.error);
        }
    };

    // Cancel contract
    const cancelContract = async () => {
        if (!contractId) return;
        try {
            const response = await deleteContract(contractId);
            toast.success(response.message);
            setContractUpdated(prev => !prev);
        } catch (error: any) {
            toast.error(error.error);
        }
    };

    const handleAction = () => {
        if (actionType === "make" && selectedFreelancer) {
            makeContract(selectedFreelancer);
        } else if (actionType === "cancel") {
            cancelContract();
        }
        setOpenDialog(false);
    };

    return (
        <div className="p-5 mt-16 max-w-6xl mx-auto">
            <div className="rounded-lg p-6 bg-white dark:bg-gray-950">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold">{job.title}</h1>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <span
                            className={`flex items-center gap-1 px-3 py-1 text-xs sm:text-sm rounded-lg font-semibold shadow-sm transition-all duration-200 ease-in-out
                                ${job.status === "Open"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/40"
                                    : job.status === "Ongoing"
                                        ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/40"
                                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40"
                                }`}
                        >
                            {job.status === "Open" && <CircleCheck className="w-4 h-4 text-green-600 dark:text-green-400" />}
                            {job.status === "Ongoing" && <Hourglass className="w-4 h-4 text-orange-600 dark:text-orange-400" />}
                            {job.status === "Closed" && <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />}
    
                            {job.status}
                        </span>

                        {userRole === "client" && (
                            <button
                                onClick={handleEdit}
                                className="flex items-center justify-center gap-2 px-3 py-1 text-xs sm:text-sm 
                                w-full sm:w-auto rounded-lg border border-gray-300 hover:border-gray-400 
                                dark:border-gray-700 dark:hover:border-gray-600 transition-colors duration-200"
                            >
                                <FileEdit className="w-4 h-4" />
                                <span>Edit Job</span>
                            </button>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Client Info */}
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Posted by:</span>
                        <span className="ml-2">{job.clientId?.name}</span>
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
                        <p>
                            {userRole === "client" ? `Applications: ${job.applicants}` : `Posted on: ${dayjs(job.createdAt).format("DD MMM YYYY")}`}
                        </p>
                        {userRole === "client" && <p>Posted on: {dayjs(job.createdAt).format("DD MMM YYYY")}</p>}
                    </div>

                    <hr />
                    
                    {/* Applicants Section */}
                    {userRole === "client" && applicants.length > 0 && (
                        <div className="pt-6">
                            <h2 className="text-lg font-semibold">Applicants</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-600">showing {applicants.length} out of {applicants.length}</p>
                            <div className="space-y-4">
                                {applicants.map((applicant) => (
                                    <div
                                        key={applicant._id}
                                        className="p-4 border rounded-md bg-gray-100 dark:bg-gray-900 mt-4"
                                    >
                                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-3">
                                            <img
                                                src={applicant.freelancerId.profilePic || "/default-profile.png"}
                                                alt={applicant.freelancerId.firstName}
                                                className="w-12 h-12 rounded-full"
                                                onClick={() => navigate(`/client/job/applied-freelancer/${applicant.freelancerId.userId}`)}
                                            />
                                            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                                                <h3
                                                    className="text-md font-medium cursor-pointer"
                                                    onClick={() => navigate(`/client/job/applied-freelancer/${applicant.freelancerId.userId}`)}
                                                >
                                                    {applicant.freelancerId.firstName}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {applicant.freelancerId.title || "No title provided"}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    🏅 {applicant.freelancerId.experienceLevel}
                                                </p>
                                            </div>
                                            <div className="w-full sm:w-auto sm:ml-auto flex justify-center sm:justify-end gap-2">
                                                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                                                    {!(contract?.escrowPaid) && (
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                onClick={() => {
                                                                    setActionType(contractedFreelancer === applicant.freelancerId.userId ? "cancel" : "make");
                                                                    setSelectedFreelancer(applicant.freelancerId.userId);
                                                                    setOpenDialog(true);
                                                                }}
                                                                disabled={contractedFreelancer !== null && contractedFreelancer !== applicant.freelancerId.userId}
                                                                className={`w-full sm:w-auto px-3 py-1.5 sm:px-4 sm:py-2 flex items-center justify-center gap-2 text-xs sm:text-sm 
                                                                    ${contractedFreelancer === applicant.freelancerId.userId
                                                                        ? "bg-red-600 hover:bg-red-700"
                                                                        : "bg-slate-700 hover:bg-slate-600 dark:hover:text-gray-300"
                                                                    } text-gray-100 rounded-lg`}
                                                            >
                                                                <BriefcaseBusiness className="w-5 h-5" />
                                                                {contractedFreelancer === applicant.freelancerId.userId ? "Cancel Contract" : "Make Contract"}
                                                            </Button>
                                                        </DialogTrigger>
                                                    )}
                                                    <DialogContent className="max-w-[90%] sm:max-w-md rounded-lg p-6">
                                                        <DialogHeader>
                                                            <DialogTitle>
                                                                {actionType === "make" ? "Confirm Contract" : "Cancel Contract"}
                                                            </DialogTitle>
                                                            <DialogDescription>
                                                                {actionType === "make"
                                                                    ? "Are you sure you want to create a contract with this freelancer?"
                                                                    : "Are you sure you want to cancel this contract?"}
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <DialogFooter className="flex justify-end gap-3">
                                                            <Button variant="outline" onClick={() => setOpenDialog(false)}>
                                                                Cancel
                                                            </Button>
                                                            <Button variant="default" onClick={handleAction}>
                                                                {actionType === "make" ? "Confirm Contract" : "Cancel Contract"}
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                                {contract && contractedFreelancer === applicant.freelancerId.userId && (
                                                    <div className="w-full sm:w-auto sm:ml-auto flex justify-center sm:justify-end">
                                                        <Button
                                                            onClick={() => navigate(`/client/contract/${contract._id}`)}
                                                            className="px-3 py-1.5 sm:px-4 sm:py-2 flex items-center justify-center gap-2 text-xs sm:text-sm border border-[#0077B6] text-[#0077B6] bg-transparent 
                                                                    hover:bg-[#0077B611] hover:text-[#0077B6] 
                                                                    dark:border-[#00FFE5] dark:text-[#ffffff] dark:hover:bg-[#00FFE511] dark:hover:text-[#00FFE5]"
                                                        >
                                                            📄 View Contract
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Buttons for freelancers */}
                    {userRole === "freelancer" && (
                        <div className="flex flex-col sm:flex-row sm:justify-end items-center gap-3 mt-12 sm:mt-[0px]">
                            <Button
                                onClick={() => console.log("Save Job clicked")}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-[#0077B6] text-[#0077B6] bg-transparent 
                            hover:bg-[#0077B611] hover:text-[#0077B6] 
                            dark:border-[#e2e2e2] dark:text-[#e2e2e2] dark:hover:bg-[#00ffe500] dark:hover:text-[#64f3bcbf] w-full sm:w-auto"
                            >
                                <Bookmark className="w-4 h-4" />
                                Save Job
                            </Button>
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    {job.status !== "Open" ? "" : (
                                        <Button
                                            className="px-4 py-2 text-sm font-medium bg-[#0077B6] hover:bg-[#005f8c] text-white rounded-lg 
                                        dark:bg-gradient-to-r dark:from-emerald-400 dark:to-cyan-400 dark:text-black w-full sm:w-auto"
                                        >
                                            {isApplied ? "Applied" : "Apply This Job"}
                                        </Button>
                                    )}
                                </DialogTrigger>
                                <DialogContent className="max-w-[90%] sm:max-w-md rounded-lg p-6">
                                    <DialogHeader>
                                        <DialogTitle className="text-lg font-semibold">Confirm Job Application</DialogTitle>
                                        <DialogDescription>
                                            Are you sure you want to apply for this job? Once applied, you won't be able to withdraw immediately.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter className="flex justify-end gap-3">
                                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                                        <Button onClick={handleApplyJob}>
                                            Confirm & Apply
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobDetail;