import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useState, useEffect } from "react";
import useMobile from "@/hooks/useMobile";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from "@/components/ui/pagination";
import { getAdminTransactions } from "@/api/admin/escrowApi";
import dayjs from "dayjs";
import { Input } from "@/components/ui/input";
import { AdminTransaction } from "@/types/Types";
import { TableSkeleton } from "@/components/ui/TableSkeleton";

const Payments = () => {
    const isMobile = useMobile();
    const [isCollapsed, setIsCollapsed] = useState(isMobile);
    const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const res = await getAdminTransactions();
                setTransactions(res.data);
            } catch (err) {
                console.error("Error fetching transactions:", err);
            } finally {
                setIsLoading(false)
            }
        };
        fetchData();
    }, []);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    const filteredTransactions = transactions.filter((tx) =>
        tx.clientId?.name.toLowerCase().includes(search.toLowerCase()) ||
        tx.transactionType.toLowerCase().includes(search.toLowerCase()) ||
        tx.amount.toString().includes(search)
    );

    const paginatedData = filteredTransactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-black flex">
            <AdminSidebar
                isCollapsed={isCollapsed}
                toggleSidebar={toggleSidebar}
                isMobile={isMobile}
            />

            <div className="flex-1">
                <AdminNavbar toggleSidebar={toggleSidebar} />

                <main className="p-6 bg-gray-300 dark:bg-zinc-900 min-h-[calc(100vh-4rem)]">
                    <h1 className="text-gray-900 dark:text-white text-xl font-semibold mb-4">
                        Payments
                    </h1>

                    <div className="mb-4 flex items-center justify-between">
                        <div className="relative w-64">
                            <Input
                                type="text"
                                placeholder="Search transactions..."
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

                    <div className="bg-gray-200 dark:bg-zinc-800 p-4 rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-300 dark:bg-zinc-700">
                                    <TableHead className="text-center text-gray-900 dark:text-white">SI No</TableHead>
                                    <TableHead className="text-center text-gray-900 dark:text-white">Amount</TableHead>
                                    <TableHead className="text-center text-gray-900 dark:text-white">Platform Fee</TableHead>
                                    <TableHead className="text-center text-gray-900 dark:text-white">Date</TableHead>
                                    <TableHead className="text-center text-gray-900 dark:text-white">Client</TableHead>
                                    {/* <TableHead className="text-center text-gray-900 dark:text-white">Transaction</TableHead> */}
                                    <TableHead className="text-center text-gray-900 dark:text-white">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableSkeleton rows={5} columns={6} />
                                ) :
                                    paginatedData.length > 0 ? (
                                        paginatedData.map((tx, index) => (
                                            <TableRow key={tx._id}>
                                                <TableCell className="text-center">
                                                    {(currentPage - 1) * itemsPerPage + index + 1}
                                                </TableCell>
                                                <TableCell className="text-center">₹{tx.amount}</TableCell>
                                                <TableCell className="text-center">₹{tx.platformFee.toFixed(2)}</TableCell>
                                                <TableCell className="text-center">{dayjs(tx.createdAt).format("DD MMM YYYY")}</TableCell>
                                                <TableCell className="text-center">{tx.clientId?.name || "-"}</TableCell>
                                                {/* <TableCell className="text-center capitalize">{tx.transactionType}</TableCell> */}
                                                <TableCell className="text-center capitalize">{tx.status}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center text-gray-500 dark:text-gray-400">
                                                No transactions found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="mt-6 flex justify-center">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                    />
                                </PaginationItem>

                                {[...Array(Math.ceil(filteredTransactions.length / itemsPerPage))].map((_, index) => (
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
                                        onClick={() =>
                                            setCurrentPage((prev) =>
                                                prev < Math.ceil(filteredTransactions.length / itemsPerPage)
                                                    ? prev + 1
                                                    : prev
                                            )
                                        }
                                        className={
                                            currentPage === Math.ceil(filteredTransactions.length / itemsPerPage)
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
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10"
                    onClick={() => setIsCollapsed(true)}
                />
            )}
        </div>
    );
};

export default Payments;