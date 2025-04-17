import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { getClientContracts } from "@/api/client/contractApi";
import Spinner from "@/components/ui/Spinner";
import { X, Eye, ChevronDown } from "lucide-react";
import { IContract } from "@/types/Types";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ViewContracts = () => {
    const clientId = useSelector((state: RootState) => state.user._id);
    const [contracts, setContracts] = useState<IContract[]>([]);
    const [visibleContracts, setVisibleContracts] = useState(5);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchContracts = async () => {
            try {
                const response = await getClientContracts(clientId);
                console.log('Client contracts', response);
                setContracts(response.data);
            } catch (error: any) {
                console.error("Failed to fetch contracts:", error.error);
                toast.error(error.error)
            } finally {
                setLoading(false);
            }
        };

        fetchContracts();
    }, [clientId]);

    const filteredContracts = contracts.filter((contract) =>
        contract.jobId.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
                <Spinner />
            </div>
        );
    };

    return (
        <div className="min-h-screen dark:bg-gray-950 flex flex-col items-center mt-20">
            <div className="w-full max-w-6xl px-6 mt-10">
                <div className="flex justify-between items-center flex-wrap gap-3">
                    <h2 className="text-xl font-semibold mt-2">My Contracts</h2>
                    <div className="w-full sm:w-72 md:w-96 lg:max-w-[600px] relative">
                        <input
                            type="text"
                            placeholder="Search contracts..."
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

                {filteredContracts.length > 0 ? (
                    <div className="flex flex-col gap-5 mt-9">
                        {filteredContracts.slice(0, visibleContracts).map((contract) => (
                            <div
                                key={contract._id}
                                className="border rounded-lg p-5 bg-gray-100 dark:bg-gray-900 hover:bg-white dark:hover:bg-gray-950 transition duration-200"
                            >
                                <div className="flex justify-between items-center">
                                    <h5 className="font-semibold">{contract.jobId.title}</h5>
                                    <Eye
                                        className="text-gray-500 cursor-pointer hover:text-gray-700 w-5 h-5"
                                        onClick={() => navigate(`/client/contract/${contract._id}`)}
                                    />
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-400 mt-1">
                                    Budget: ₹{contract.amount}
                                </p>
                                <p className="text-sm mt-1 text-gray-700 dark:text-gray-400">
                                    Contract:{" "}
                                    <span
                                        className={
                                            contract.status === "Canceled"
                                                ? "text-red-600 dark:text-red-400"
                                                : contract.status === "Completed"
                                                    ? "text-green-600 dark:text-green-500"
                                                    : "text-gray-700 dark:text-gray-400"
                                        }
                                    >
                                        {contract.status}
                                    </span>
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-400 mt-1">
                                    Freelancer: {contract.freelancerId.name}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">
                                    Contract ID: {contract.contractId}
                                </p>
                            </div>
                        ))}
                        {visibleContracts < filteredContracts.length && (
                            <p
                                onClick={() => setVisibleContracts((prev) => prev + 5)}
                                className="mt-4 text-blue-950 px-4 py-2 flex items-center gap-2
                            dark:bg-transparent dark:text-[#00FFE5] self-center cursor-pointer"
                            >
                                View More
                                <ChevronDown className="w-4 h-4" />
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="p-10 mt-4 flex flex-col items-center text-center bg-white dark:bg-gray-950">
                        <p className="text-gray-600 mt-4">No contracts found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewContracts;