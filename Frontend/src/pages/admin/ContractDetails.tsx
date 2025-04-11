import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";
import useMobile from "@/hooks/useMobile";
import { contractDetails } from "@/api/freelancer/contractApi";
import Spinner from "@/components/ui/Spinner";
import dayjs from "dayjs";
import { IContractDetails } from "@/types/Types";
import { releaseFundToFreelancer } from "@/api/admin/escrowApi";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import toast from "react-hot-toast";
import { Handshake, Loader2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContractDetails = () => {
    const { contractId } = useParams<{ contractId: string }>();
    const isMobile = useMobile();
    const [isCollapsed, setIsCollapsed] = useState(isMobile);
    const [contract, setContract] = useState<IContractDetails | null>(null);
    const [requestStatus, setRequestStatus] = useState<string | null>(null);
    const [isReleasing, setIsReleasing] = useState(false);
    const [isReleased, setIsReleased] = useState(false);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContractDetails = async () => {
            try {
                const response = await contractDetails(contractId!);
                setContract(response.contract);
                setRequestStatus(response.contract.releaseFundStatus);
            } catch (error) {
                console.error("Failed to fetch contract details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContractDetails();
    }, [contractId]);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    const releaseFund = async () => {
        setIsReleasing(true);
        try {
            await releaseFundToFreelancer(contract!._id);
            setIsReleased(true);
            setOpen(false);
            toast.success("Payment successfully released to the freelancer!");
        } catch (err) {
            console.error("Fund release failed", err);
            toast.error("Failed to release payment. Please try again.");
        } finally {
            setIsReleasing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-200 dark:bg-zinc-800 flex">
            <AdminSidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} isMobile={isMobile} />

            <div className="flex-1">
                <AdminNavbar toggleSidebar={toggleSidebar} />

                {/* Main Content */}
                <main className="p-6 bg-gray-300 dark:bg-zinc-900 min-h-[calc(100vh-4rem)] flex justify-center items-center">
                    {loading ? (
                        <Spinner />
                    ) : contract ? (
                        <div className="rounded-lg p-6 bg-gray-200 dark:bg-zinc-800 w-full max-w-6xl">
                            <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Contract Details</h1>
                            <div className="space-y-6">
                                {/* Contract Info */}
                                <div className="flex justify-between items-center">
                                    <p className="text-base text-gray-600 dark:text-gray-400">
                                        <span className="font-medium">Contract ID:</span> {contract.contractId}
                                    </p>
                                    <p className="text-base text-gray-600 dark:text-gray-400">
                                        <span className="font-medium">Status:</span> {contract.status}
                                    </p>
                                </div>

                                {/* Parties Involved */}
                                <div className="space-y-6">
                                    <h2 className="text-lg font-semibold border-b pb-2">Parties Involved</h2>

                                    {/* Freelancer & Client Info */}
                                    <div className="flex justify-between items-start space-x-12">
                                        {/* Freelancer Info */}
                                        <div className="w-1/2">
                                            <h3 className="text-medium font-semibold dark:text-teal-500 text-cyan-800">FREELANCER</h3>
                                            <p className="text-base text-gray-600 dark:text-gray-400">
                                                <span className="font-medium">Name:</span> {contract.freelancerId.name}
                                            </p>
                                            <p className="text-base text-gray-600 dark:text-gray-400">
                                                <span className="font-medium">Email:</span> {contract.freelancerId.email}
                                            </p>
                                        </div>

                                        {/* Client Info */}
                                        <div className="w-1/2 text-right">
                                            <h3 className="text-medium font-semibold dark:text-teal-500 text-cyan-800">CLIENT</h3>
                                            <p className="text-base text-gray-600 dark:text-gray-400">
                                                <span className="font-medium">Name:</span> {contract.clientId.name}
                                            </p>
                                            <p className="text-base text-gray-600 dark:text-gray-400">
                                                <span className="font-medium">Email:</span> {contract.clientId.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Job Details */}
                                <div className="space-y-4">
                                    <h2 className="text-lg font-semibold border-b pb-2">Job Details</h2>
                                    <p className="text-base text-gray-600 dark:text-gray-400">
                                        <span className="font-medium">Title:</span> {contract.jobId.title}
                                    </p>
                                    <p className="text-base text-gray-600 dark:text-gray-400">
                                        <span className="font-medium">Rate:</span> ₹{contract.jobId.rate}
                                    </p>
                                </div>

                                {/* Additional Details */}
                                <div className="space-y-4">
                                    <h2 className="text-lg font-semibold border-b pb-2">Additional Details</h2>
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                        <div className="space-y-2">
                                            <p className="text-base text-gray-600 dark:text-gray-400">
                                                <span className="font-medium">Budget:</span> ₹{contract.amount}
                                            </p>
                                            <p className="text-base text-gray-600 dark:text-gray-400">
                                                <span className="font-medium">Created At:</span> {dayjs(contract.createdAt).format("DD MMM YYYY")}
                                            </p>
                                        </div>

                                        {contract?.releaseFundStatus === "Requested" && (
                                            <Dialog open={open} onOpenChange={setOpen}>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        disabled={isReleased || requestStatus === "Released"}
                                                        className={`group mt-4 text-sm px-5 py-2 rounded-full flex items-center gap-2 text-white transition-all duration-300 shadow-md ${isReleased || requestStatus === "Released"
                                                                ? "bg-gray-400 cursor-not-allowed"
                                                                : "bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500 hover:from-purple-700 hover:to-indigo-700 dark:hover:from-purple-600 dark:hover:to-indigo-600"
                                                            }`}
                                                    >
                                                        {isReleased || requestStatus === "Released" ? (
                                                            <>
                                                                <Wallet className="w-4 h-4" />
                                                                Released
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Handshake className="w-4 h-4 transition-transform group-hover:scale-110" />
                                                                Pay Freelancer
                                                            </>
                                                        )}
                                                    </Button>

                                                </DialogTrigger>

                                                <DialogContent className="sm:max-w-md">
                                                    <DialogHeader>
                                                        <DialogTitle>Confirm Final Fund Release</DialogTitle>
                                                        <p className="text-sm text-muted-foreground">
                                                            This will release the escrowed funds to the freelancer. Are you sure you want to proceed?
                                                        </p>
                                                    </DialogHeader>
                                                    <DialogFooter>
                                                        <Button variant="outline" onClick={() => setOpen(false)}>
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            onClick={releaseFund} // ✅ FIXED HERE
                                                            disabled={isReleasing}
                                                            className="bg-green-600 hover:bg-green-700 text-white transition-all flex items-center gap-2"
                                                        >
                                                            {isReleasing && <Loader2 className="w-4 h-4 animate-spin" />}
                                                            {isReleasing ? "Processing..." : "Confirm & Release"}
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400">Contract not found.</p>
                    )}
                </main>
            </div>

            {!isCollapsed && isMobile && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10" onClick={() => setIsCollapsed(true)} />
            )}
        </div>
    );
};

export default ContractDetails;