import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWallet, transactions as getTransactions, GetSalesReport } from "@/api/freelancer/WalletApi";
import { Wallet, Transaction } from "@/types/Types";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import WalletSkeleton from "../ui/WalletSkeleton";
import NoWalletData from "./NoWalletFound";

const ViewEarnings = () => {
    const userId = useSelector((state: RootState) => state.user._id);

    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [sortAsc, setSortAsc] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [salesReport, setSalesReport] = useState<any[]>([]);

    const itemsPerPage = 5;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                if (userId) {
                    const walletRes = await getWallet(userId);
                    setWallet(walletRes.data);
                    const txRes = await getTransactions(walletRes.data._id);
                    setTransactions(txRes.data);
                    const salesData = await GetSalesReport(userId);
                    setSalesReport(salesData.data);
                }
            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, [userId]);

    // Sort transactions by date
    const sortedTransactions = [...transactions].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortAsc ? dateA - dateB : dateB - dateA;
    });

    const paginatedTx = sortedTransactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(transactions.length / itemsPerPage);

    const formattedSalesData = salesReport.map((item) => ({
        month: item.month,
        totalRevenue: item.totalRevenue,
    }));

    return (
        <div className="flex justify-center items-center min-h-screen bg-white dark:bg-gray-950 p-4 mt-20">
            {loading ? (
                <WalletSkeleton />
            ) : wallet ? (
                <div className="w-full max-w-4xl space-y-6 mt-6">
                        
                    {/* Wallet Summary Card */}
                    <Card className="border dark:border-gray-800 shadown-none border-gray-300">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold">Wallet Balance</CardTitle>
                            <p className="text-sm text-muted-foreground">Total Earnings</p>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-[#0077B6] 
                            dark:bg-gradient-to-r dark:from-emerald-400 dark:to-cyan-400 
                            dark:bg-clip-text dark:text-transparent">
                                ₹ {wallet.balance}
                            </div>
                        </CardContent>
                    </Card>
                        
                    {/* Sales Report Graph */}
                    <Card className="border dark:border-gray-800 shadown-none border-gray-300">
                        <CardHeader className="flex flex-row justify-between items-center">
                            <CardTitle className="text-lg">Earnings Report</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={formattedSalesData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="totalRevenue" stroke="#8884d8" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Transactions Table */}
                    <Card className="border dark:border-gray-800 shadown-none border-gray-300">
                        <CardHeader className="flex flex-row justify-between items-center">
                            <CardTitle className="text-lg">Transactions</CardTitle>
                            <button
                                onClick={() => setSortAsc(!sortAsc)}
                                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                Sort by Date {sortAsc ? "↑" : "↓"}
                            </button>
                        </CardHeader>
                        <CardContent className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Contract ID</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedTx.map((tx) => (
                                        <TableRow key={tx._id}>
                                            <TableCell>{tx.description}</TableCell>
                                            <TableCell>{tx.contractId}</TableCell>
                                            <TableCell>
                                                {new Date(tx.date).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={tx.type === "credit" ? "default" : "destructive"}>
                                                    {tx.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>₹ {tx.amount}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* Pagination */}
                            <Pagination className="mt-4">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                        />
                                    </PaginationItem>
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <PaginationItem key={i}>
                                            <PaginationLink
                                                isActive={i + 1 === currentPage}
                                                onClick={() => setCurrentPage(i + 1)}
                                            >
                                                {i + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}
                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() =>
                                                setCurrentPage((p) =>
                                                    p < totalPages ? p + 1 : p
                                                )
                                            }
                                            className={
                                                currentPage === totalPages
                                                    ? "pointer-events-none opacity-50"
                                                    : ""
                                            }
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <NoWalletData />
            )}
        </div>
    );
};

export default ViewEarnings;