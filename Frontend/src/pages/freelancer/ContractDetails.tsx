import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "@/components/ui/Spinner";
import { IContract } from "@/types/Types";
import dayjs from "dayjs";
import { contractDetails, approveContract } from "@/api/freelancer/contractApi";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { XCircleIcon } from "lucide-react";
import { deleteContract } from "@/api/client/contractApi";

const ContractDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [contract, setContract] = useState<IContract | null>(null);
    const [loading, setLoading] = useState(true);
    const [isApplied, setIsApplied] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchContract = async () => {
            if (!id) {
                setLoading(false);
                return;
            }
            try {
                const response = await contractDetails(id);
                setContract(response.contract);
                setIsApplied(response.contract.isApproved);
            } catch (error) {
                console.error("Failed to fetch contract details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchContract();
    }, [id]);

    const handleApprove = async () => {
        if (!contract) return;

        try {
            await approveContract(contract._id, contract.freelancerId._id);
            toast.success("Contract accepted!");
            setIsApplied(true);
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
                <Spinner />
            </div>
        );
    }

    if (!contract || !id) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen text-center">
                <XCircleIcon className="w-16 h-16 text-gray-400 dark:text-gray-600" />
                <p className="mt-4 text-lg font-semibold text-gray-600 dark:text-gray-400">
                    Contract not found.
                </p>
            </div>
        );
    };

    // Cancel contract
    const cancelContract = async () => {
        if (!contract?._id) return;
    
        try {
            const response = await deleteContract(contract._id);
            toast.success(response.message);
            setTimeout(() => {
                navigate("/freelancer/contracts");
            }, 2000); 
            setContract(null);
        } catch (error: any) {
            toast.error(error.error);
        }
    };

    return (
        <div className="p-5 mt-16 max-w-6xl mx-auto">
            <div className="rounded-lg p-6 bg-white dark:bg-gray-950">
                <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Skillora Freelancer Contract</h1>
                <div className="space-y-6">
                    {/* Contract Details */}
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

                        {/* Freelancer Info */}
                        <div className="space-y-2">
                            <h2 className="text-medium font-semibold dark:text-teal-500 text-cyan-800">FREELANCER</h2>
                            <p className="text-base text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Name:</span> {contract.freelancerId.name}
                            </p>
                            <p className="text-base text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Email:</span> {contract.freelancerId.email}
                            </p>
                        </div>

                        {/* Client Info */}
                        <div className="space-y-2">
                            <h3 className="text-base font-semibold dark:text-teal-500 text-cyan-800">CLIENT</h3>
                            <p className="text-base text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Name:</span> {contract.clientId.name}
                            </p>
                            <p className="text-base text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Email:</span> {contract.clientId.email}
                            </p>
                        </div>
                    </div>

                    {/* Job Details */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold border-b pb-2">Job Details</h2>
                        <p className="text-base text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Title:</span> {contract.jobId.title}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Description:</span> {contract.jobId.description}
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
                                    <span className="font-medium">Escrow Paid:</span> {contract.escrowPaid ? "Yes" : "No"}
                                </p>
                                <p className="text-base text-gray-600 dark:text-gray-400">
                                    <span className="font-medium">Created At:</span> {dayjs(contract.createdAt).format("DD MMM YYYY")}
                                </p>
                            </div>
                            <div className="flex gap-4 mt-4 md:mt-0">
                                {!contract.escrowPaid && ( 
                                    <Button
                                        className="border border-[#DC2626] text-[#DC2626] bg-transparent 
                                        hover:bg-[#DC262611] hover:text-[#DC2626] 
                                        dark:border-[#FF5252] dark:text-[#ffffff] dark:hover:bg-[#FF525211] dark:hover:text-[#FF5252] py-2 px-4 rounded transition duration-200"
                                        onClick={cancelContract}
                                    >
                                        Reject
                                    </Button>
                                )}
                                <Button
                                    className={`border ${isApplied
                                            ? "border-gray-400 text-gray-400 cursor-not-allowed"
                                            : "border-[#0077B6] text-[#0077B6] hover:bg-[#0077B611] hover:text-[#0077B6]"
                                        } bg-transparent dark:border-[#00FFE5] dark:text-[#ffffff] dark:hover:bg-[#00FFE511] dark:hover:text-[#00FFE5] py-2 px-4 rounded transition duration-200`}
                                    onClick={isApplied ? undefined : handleApprove}
                                    disabled={isApplied}
                                >
                                    {isApplied ? "Accepted" : "Accept"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContractDetails;