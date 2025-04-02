import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import useMobile from "@/hooks/useMobile";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { fetchAllContracts } from "@/api/admin/contractApi";
import { IContract } from "@/types/Types";
import { Button } from "@/components/ui/button";

const Contracts = () => {
    const isMobile = useMobile();
    const navigate = useNavigate(); // Initialize useNavigate
    const [isCollapsed, setIsCollapsed] = useState(isMobile);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [contracts, setContracts] = useState<IContract[]>([]);
    const itemsPerPage = 5;

    useEffect(() => {
        loadContracts();
    }, []);

    const loadContracts = async () => {
        try {
            const response = await fetchAllContracts();
            setContracts(response.data);
        } catch (error) {
            console.error("Failed to fetch contracts:", error);
        }
    };

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    const handleViewContract = (contractId: string) => {
        navigate(`/admin/contracts/${contractId}`); // Navigate to the contract details page
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-black flex">
            <AdminSidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} isMobile={isMobile} />

            <div className="flex-1">
                <AdminNavbar toggleSidebar={toggleSidebar} />

                <main className="p-6 bg-gray-300 dark:bg-zinc-900 min-h-[calc(100vh-4rem)]">
                    <h1 className="text-gray-900 dark:text-white text-xl font-semibold mb-4">Contracts</h1>

                    {/* Search Input */}
                    <div className="mb-4 flex items-center justify-between">
                        <div className="relative w-64">
                            <Input
                                type="text"
                                placeholder="Search contracts..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-300 placeholder:text-xs pr-10"
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch("")}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                                >
                                    x
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Contracts Table */}
                    <div className="bg-gray-200 dark:bg-zinc-800 p-4 rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-300 dark:bg-zinc-700">
                                    <TableHead className="text-center text-gray-900 dark:text-white">SI No</TableHead>
                                    <TableHead className="text-center text-gray-900 dark:text-white">Contract ID</TableHead>
                                    <TableHead className="text-center text-gray-900 dark:text-white">Client</TableHead>
                                    <TableHead className="text-center text-gray-900 dark:text-white">Freelancer</TableHead>
                                    <TableHead className="text-center text-gray-900 dark:text-white">Status</TableHead>
                                    <TableHead className="text-center text-gray-900 dark:text-white">Amount</TableHead>
                                    <TableHead className="text-center text-gray-900 dark:text-white">Escrow Paid</TableHead>
                                    <TableHead className="text-center text-gray-900 dark:text-white">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {contracts.length > 0 ? (
                                    contracts
                                        .filter((contract) =>
                                            contract.contractId.toLowerCase().includes(search.toLowerCase())
                                        )
                                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                        .map((contract, index) => (
                                            <TableRow key={contract._id}>
                                                <TableCell className="text-center">
                                                    {(currentPage - 1) * itemsPerPage + index + 1}
                                                </TableCell>
                                                <TableCell className="text-center">{contract.contractId}</TableCell>
                                                <TableCell className="text-center">{contract.clientId.name}</TableCell>
                                                <TableCell className="text-center">{contract.freelancerId.name}</TableCell>
                                                <TableCell className="text-center">{contract.status}</TableCell>
                                                <TableCell className="text-center">{contract.amount}</TableCell>
                                                <TableCell className="text-center">
                                                    {contract.escrowPaid ? "Yes" : "No"}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Button
                                                        onClick={() => handleViewContract(contract._id)}
                                                        className="bg-slate-600 text-white text-xs px-3 py-1 hover:bg-slate-700"
                                                    >
                                                        View
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-gray-500 dark:text-gray-400">
                                            No contracts found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="mt-6 flex justify-center">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => setCurrentPage((prev) => prev - 1)}
                                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                    />
                                </PaginationItem>

                                {[...Array(Math.ceil(contracts.length / itemsPerPage))].map((_, index) => (
                                    <PaginationItem key={index}>
                                        <PaginationLink
                                            isActive={currentPage === index + 1}
                                            onClick={() => setCurrentPage(index + 1)}
                                        >
                                            {index + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}

                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() => setCurrentPage((prev) => prev + 1)}
                                        className={
                                            currentPage === Math.ceil(contracts.length / itemsPerPage)
                                                ? "pointer-events-none opacity-50"
                                                : ""
                                        }
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </main>
            </div>

            {!isCollapsed && isMobile && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10" onClick={() => setIsCollapsed(true)} />
            )}
        </div>
    );
};

export default Contracts;