import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "@/components/ui/Spinner";
import { IContract } from "@/types/Types";
import dayjs from "dayjs";
import { contractDetails } from "@/api/freelancer/contractApi";
import { Button } from "@/components/ui/button";
import { BriefcaseBusiness, XCircleIcon } from "lucide-react";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import Axios from "@/api/axios/axiosInstance";

const ClientContractDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [contract, setContract] = useState<IContract | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const stripe = useStripe()
    const elements = useElements();

    useEffect(() => {
        const fetchContract = async () => {
            if (!id) {
                setLoading(false);
                return;
            }
            try {
                const response = await contractDetails(id);
                setContract(response.contract);
            } catch (error: any) {
                console.error("ERROR:", error);
                setError(error?.message);
            } finally {
                setLoading(false);
            }
        };
        fetchContract();
    }, [id]);

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
        setLoading(true);
        try {
            if (!stripe || !elements || !id || !contract) return;
    
            console.log('JOB ID:', id);
            console.log('FREELANCER ID:', freelancerId);
    
            const response = await Axios.post(`/api/client/job/payment/${contract.jobId._id}`, {
                title: contract.jobId.title,
                rate: contract.jobId.rate,
                freelancerId: freelancerId
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
            {!contract.isApproved && (
                <div className="bg-yellow-100 dark:bg-gray-900 text-yellow-800 dark:text-yellow-300 py-2 px-4 rounded mb-4 text-center text-xs font-semibold">
                    Your contract is pending approval! The freelancer must accept it before you can proceed. Please wait for confirmation.
                </div>
            )}
            <div className="rounded-lg p-6 bg-white dark:bg-gray-950">
                <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Skillora Client Contract</h1>
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <p className="text-base text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Contract ID:</span> {contract.contractId}
                        </p>
                        <p className="text-base text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Status:</span> {contract.status}
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold border-b pb-2">Parties Involved</h2>

                        {/* Freelancer Info */}
                        <div className="space-y-2">
                            <h3 className="text-medium font-semibold dark:text-teal-500 text-cyan-800">FREELANCER</h3>
                            <p className="text-base text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Name:</span> {contract.freelancerId.name}
                            </p>
                            <p className="text-base text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Email:</span> {contract.freelancerId.email}
                            </p>
                        </div>

                        {/* Client Info */}
                        <div className="space-y-2">
                            <h3 className="text-medium font-semibold dark:text-teal-500 text-cyan-800">CLIENT</h3>
                            <p className="text-base text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Name:</span> {contract.clientId.name}
                            </p>
                            <p className="text-base text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Email:</span> {contract.clientId.email}
                            </p>
                        </div>
                    </div>

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
                            {contract.isApproved && !contract.escrowPaid && (
                                <div className="flex gap-4 mt-4 md:mt-0">
                                    <Button
                                        className="border border-[#0077B6] text-[#0077B6] bg-transparent 
                                        hover:bg-[#0076b60f] hover:text-[#0077B6] 
                                        dark:border-[#7b7b7b] dark:text-[#ffffff] dark:hover:bg-[#00FFE511] dark:hover:text-[#4a93e1] 
                                        py-2 px-4 rounded transition duration-200"
                                        onClick={() => handleCheckout(contract.freelancerId._id)}
                                    >
                                        <BriefcaseBusiness className="w-5 h-5" /> Hire
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientContractDetails;