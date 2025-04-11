import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "@/components/ui/Spinner";
import { IContract } from "@/types/Types";
import dayjs from "dayjs";
import { contractDetails } from "@/api/freelancer/contractApi";
import { Button } from "@/components/ui/button";
import { Handshake, Loader2, Wallet, XCircleIcon } from "lucide-react";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import Axios from "@/api/axios/axiosInstance";
import ProgressBar from "@/components/progress/ProgressBar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DialogClose } from "@radix-ui/react-dialog";
import { EscrowFaqAccordion } from "@/components/accordion/EscrowFaqAccordion";
import { ContractApprovalMarquee } from "@/components/alerts/ContractApprovalAlerts";
import { EscrowPendingAlert } from "@/components/alerts/EscrowPendingAlert";
import { releaseFundRequest } from "@/api/client/contractApi";
import toast from "react-hot-toast";
import { refundToClient } from "@/api/admin/escrowApi";

const ClientContractDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [contract, setContract] = useState<IContract | null>(null);
    const [requestStatus, setRequestStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isReleasing, setIsReleasing] = useState(false);
    const [isReleased, setIsReleased] = useState(false);
    const [open, setOpen] = useState(false);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [cancelDescription, setCancelDescription] = useState("");
    const [isCanceling, setIsCanceling] = useState(false);


    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        const fetchContract = async () => {
            if (!id) {
                setLoading(false);
                return;
            }
            try {
                const response = await contractDetails(id);
                console.log('clientContractRepns', response.contract);
                setContract(response.contract);
                setRequestStatus(response.contract.releaseFundStatus);
            } catch (error: any) {
                console.error("ERROR:", error);
                setError(error?.message);
            } finally {
                setLoading(false);
            }
        };
        fetchContract();
    }, [id]);

    const handleFundRelease = async () => {
        setIsReleasing(true);
        try {
            await releaseFundRequest(contract!._id);
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

    const handleCancelContract = async () => {
        if (!contract?._id || !contract.clientId._id || !cancelReason) return;
    
        try {
            setIsCanceling(true);
            await refundToClient(
                contract._id,
                contract.clientId._id,
                cancelReason,
                cancelDescription
            );
            setContract((prev) => prev ? { ...prev, status: "Canceled" } : prev);
            setCancelDialogOpen(false);
            toast.success('Contract has been cancelled')
        } catch (err) {
            console.error(err);
            toast.error('Failed to cancel contract')
        } finally {
            setIsCanceling(false);
        }
    };
      
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
                <Spinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen text-center">
                <XCircleIcon className="w-16 h-16 text-gray-400 dark:text-gray-600" />
                <p className="mt-4 text-lg font-semibold text-gray-600 dark:text-gray-400">
                    {error}
                </p>
            </div>
        );
    }

    if (!contract) {
        return <p className="text-center mt-10">Contract not found.</p>;
    }

    const handleCheckout = async (freelancerId: string) => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setLoading(true);
        try {
            if (!stripe || !elements || !id || !contract) return;

            const response = await Axios.post(`/api/client/job/payment/${contract.jobId._id}`, {
                title: contract.jobId.title,
                rate: contract.jobId.rate,
                freelancerId: freelancerId,
            });

            const { id: sessionId } = response.data;

            const { error } = await stripe!.redirectToCheckout({ sessionId });

            if (error) {
                console.log("Error redirecting to checkout page", error);
            }
        } catch (error) {
            console.log("Error redirecting to checkout page", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-5 mt-16 max-w-6xl mx-auto">
            {!contract.isApproved && <ContractApprovalMarquee />}
            {!contract.escrowPaid && contract.isApproved && <EscrowPendingAlert />}
            <div className="rounded-lg p-6 bg-white dark:bg-gray-950">
                <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Skillora Contract</h1>
                <div className="space-y-6">
                    <div className="flex justify-between items-start flex-col sm:flex-row gap-3 sm:items-center">
                        <p className="text-base text-gray-800 dark:text-gray-400">
                            <span className="font-medium text-gray-950 dark:text-gray-200">Contract ID:</span> {contract.contractId}
                        </p>
                        <div>
                            <p
                                className={`text-base dark:text-gray-400 ${contract.status === "Canceled" ? "text-red-600 dark:text-red-500 font-semibold" : "text-gray-800"
                                    }`}
                            >
                                <span className="font-medium text-gray-950 dark:text-gray-200">Status:</span> {contract.status}
                            </p>

                            {contract.status === "Completed" && contract.releaseFundStatus !== "Approved" && (
                                <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger asChild>
                                        <Button
                                            disabled={isReleased || requestStatus === "Requested"}
                                            className={`group mt-4 text-sm px-5 py-2 rounded-full flex items-center gap-2 text-white transition-all duration-300 shadow-md ${isReleased || requestStatus === "Requested"
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500 hover:from-purple-700 hover:to-indigo-700 dark:hover:from-purple-600 dark:hover:to-indigo-600"
                                                }`}
                                        >
                                            {isReleased ? (
                                                <>
                                                    <Wallet className="w-4 h-4" />
                                                    Released
                                                </>
                                            ) : requestStatus === "Requested" ? (
                                                <>
                                                    <Wallet className="w-4 h-4" />
                                                    Fund Released
                                                </>
                                            ) : (
                                                <>
                                                    <Handshake className="w-4 h-4 transition-transform group-hover:scale-110" />
                                                    Pay Freelancer
                                                </>
                                            )}
                                        </Button>
                                    </DialogTrigger>

                                    {!isReleased && (
                                        <DialogContent className="sm:max-w-md">
                                            <DialogHeader>
                                                <DialogTitle>Confirm Payment</DialogTitle>
                                                <p className="text-sm text-muted-foreground">
                                                    Are you sure you want to release payment to the freelancer?
                                                </p>
                                            </DialogHeader>
                                            <DialogFooter>
                                                <Button variant="outline" onClick={() => setOpen(false)}>
                                                    Cancel
                                                </Button>
                                                <Button
                                                    onClick={handleFundRelease}
                                                    disabled={isReleasing}
                                                    className="bg-green-600 hover:bg-green-700 text-white transition-all flex items-center gap-2"
                                                >
                                                    {isReleasing && <Loader2 className="w-4 h-4 animate-spin" />}
                                                    {isReleasing ? "Processing..." : "Yes, Release"}
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    )}
                                </Dialog>
                            )}

                            {contract?.escrowPaid && contract.releaseFundStatus === "NotRequested" && (
                                <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button
                                            className="border border-[#DC2626] text-[#DC2626] bg-transparent 
                hover:bg-[#DC262611] hover:text-[#DC2626] 
                dark:border-[#FF5252] dark:text-[#ffff] dark:hover:bg-[#FF525211] dark:hover:text-[#ffff] -ml-2 mt-2"
                                        >
                                            Cancel Contract
                                        </Button>
                                    </DialogTrigger>

                                    <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>Confirm Cancellation</DialogTitle>
                                            <DialogDescription>
                                                You are about to cancel a contract. If the contract has already started, only a partial refund will be processed.
                                            </DialogDescription>
                                        </DialogHeader>

                                        <div className="space-y-4 mt-4">
                                            <div>
                                                <label className="text-sm font-medium">Reason</label>
                                                <select
                                                    value={cancelReason}
                                                    onChange={(e) => setCancelReason(e.target.value)}
                                                    className="w-full mt-1 p-2 border rounded-md bg-background text-foreground"
                                                >
                                                    <option value="" disabled>Select a reason</option>
                                                    <option value="Freelancer not responding">Freelancer not responding</option>
                                                    <option value="Project requirements changed">Project requirements changed</option>
                                                    <option value="Hired someone else">Hired someone else</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="text-sm font-medium">Description</label>
                                                <textarea
                                                    value={cancelDescription}
                                                    onChange={(e) => setCancelDescription(e.target.value)}
                                                    placeholder="Provide a brief reason for cancellation..."
                                                    rows={4}
                                                    className="w-full mt-1 p-2 border rounded-md bg-background text-foreground"
                                                />
                                            </div>
                                        </div>

                                        <DialogFooter className="mt-4">
                                            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
                                                Close
                                            </Button>
                                            <Button
                                                disabled={isCanceling || !cancelReason}
                                                className="bg-red-600 hover:bg-red-700 text-white transition-all"
                                                onClick={handleCancelContract}
                                            >
                                                {isCanceling ? "Processing..." : "Confirm Cancel"}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            )}

                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold border-b pb-2">Parties Involved</h2>

                        {/* Freelancer Info */}
                        <div className="space-y-2">
                            <h3 className="text-medium font-semibold dark:text-teal-500 text-cyan-700">Freelancer</h3>
                            <p className="text-base text-gray-800 dark:text-gray-400">
                                <span className="font-medium text-gray-950 dark:text-gray-200">Name:</span> {contract.freelancerId.name}
                            </p>
                            <p className="text-base text-gray-800 dark:text-gray-400">
                                <span className="font-medium text-gray-950 dark:text-gray-200">Email:</span> {contract.freelancerId.email}
                            </p>
                        </div>

                        {/* Client Info */}
                        <div className="space-y-2">
                            <h3 className="text-medium font-semibold dark:text-teal-500 text-cyan-700">Client</h3>
                            <p className="text-base text-gray-800 dark:text-gray-400">
                                <span className="font-medium text-gray-950 dark:text-gray-200">Name:</span> {contract.clientId.name}
                            </p>
                            <p className="text-base text-gray-800 dark:text-gray-400">
                                <span className="font-medium text-gray-950 dark:text-gray-200">Email:</span> {contract.clientId.email}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold border-b pb-2">Job Details</h2>
                        <p className="text-base text-gray-800 dark:text-gray-400">
                            <span className="font-medium text-gray-950 dark:text-gray-200">Title:</span> {contract.jobId.title}
                        </p>
                        <p className="text-sm text-gray-800 dark:text-gray-400">
                            <span className="font-medium text-gray-950 dark:text-gray-200">Description:</span> {contract.jobId.description}
                        </p>
                        <p className="text-base text-gray-800 dark:text-gray-400">
                            <span className="font-medium text-gray-950 dark:text-gray-200">Rate:</span> ₹{contract.jobId.rate}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold border-b pb-2">Additional Details</h2>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="space-y-2">
                                <p className="text-base text-gray-800 dark:text-gray-400">
                                    <span className="font-medium text-gray-950 dark:text-gray-200">Budget:</span> ₹{contract.amount}
                                </p>
                                <p className="text-base text-gray-800 dark:text-gray-400">
                                    <span className="font-medium text-gray-950 dark:text-gray-200">Created At:</span> {dayjs(contract.createdAt).format("DD MMM YYYY")}
                                </p>
                            </div>
                            {contract.isApproved && !contract.escrowPaid && (
                                <div className="flex gap-4 mt-4 md:mt-0">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                                className="border border-[#0077B6] text-[#0077B6] bg-transparent 
                                                hover:bg-[#0076b60f] hover:text-[#0077B6] 
                                                dark:border-[#32a376] dark:text-[#ffffff] dark:hover:bg-[#25765626] dark:hover:text-[#48c391] 
                                                py-2 px-4 rounded transition duration-200"
                                            >
                                                <Wallet className="w-5 h-5 mr-2" /> Pay Now
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-[90%] sm:max-w-md mx-auto rounded">
                                            <DialogHeader>
                                                <DialogTitle>Confirm Payment</DialogTitle>
                                            </DialogHeader>
                                            <DialogDescription>
                                                Are you sure you want to proceed with the payment? This action will initiate the escrow process.
                                            </DialogDescription>
                                            <DialogFooter className="flex justify-end gap-3">
                                                <DialogClose asChild>
                                                    <Button variant="outline">Cancel</Button>
                                                </DialogClose>
                                                <DialogClose asChild>
                                                    <Button
                                                        onClick={() => handleCheckout(contract.freelancerId._id)}
                                                    >
                                                        Yes, Pay Now
                                                    </Button>
                                                </DialogClose>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            )}
                        </div>
                        {!contract.escrowPaid && <EscrowFaqAccordion />}
                    </div>
                    {/* Progress Bar */}
                    {contract.escrowPaid && contract.status !== "Canceled" && (
                        <div className="mt-8">
                            <h2 className="text-lg font-semibold border-b pb-2">Work Progress</h2>
                            <ProgressBar workStatus={contract.status} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientContractDetails;