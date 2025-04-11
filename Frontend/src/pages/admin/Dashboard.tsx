import { useEffect, useState } from "react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import useMobile from "@/hooks/useMobile";
import { escrowBalance, totalRevenue } from "@/api/admin/escrowApi";
import Spinner from "@/components/ui/Spinner";
import { GiMoneyStack } from "react-icons/gi";
import { FaUserTie } from "react-icons/fa";
import { GrUserWorker } from "react-icons/gr";
import { fetchClients, fetchFreelancers } from "@/api/admin/adminApi";

const Dashboard = () => {
    const isMobile = useMobile();
    const [isCollapsed, setIsCollapsed] = useState(isMobile);
    const [loading, setLoading] = useState(true);
    const [escrowAmount, setEscrowAmount] = useState<number | null>(null);
    const [revenue, setRevenue] = useState<number | null>(null);
    const [freelancerCount, setFreelancerCount] = useState<number>(0);
    const [clientCount, setClientCount] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [escrowRes, clientsRes, freelancersRes, revenueRes] = await Promise.all([
                    escrowBalance(),
                    fetchClients(),
                    fetchFreelancers(),
                    totalRevenue()
                ]);
    
                setEscrowAmount(escrowRes.data);
                setRevenue(revenueRes.data);
                setClientCount(clientsRes.data.length);
                setFreelancerCount(freelancersRes.data.length);
            } catch (err: any) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };
    
        fetchDashboardData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-black flex">
            <AdminSidebar
                isCollapsed={isCollapsed}
                toggleSidebar={toggleSidebar}
                isMobile={isMobile}
            />
            <div className="flex-1">
                <AdminNavbar toggleSidebar={toggleSidebar} />

                <main className="p-6 bg-gray-300 dark:bg-zinc-900 min-h-[calc(100vh-4rem)] relative">
                    <h1 className="text-gray-900 dark:text-white text-xl font-semibold mb-4">Dashboard</h1>
                    {loading ? (
                        <div className="absolute inset-0 flex justify-center items-center">
                            <Spinner />
                        </div>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <div className="flex flex-wrap gap-6">
                            {/* Escrow Balance */}
                            <div className="bg-gray-200 dark:bg-zinc-800 rounded-xl shadow-md p-6 flex items-center gap-4 w-full sm:w-64 h-24">
                                <div className="p-3 text-green-600 dark:text-green-300 rounded-full">
                                    <GiMoneyStack size={38} />
                                </div>
                                <div>
                                    <h2 className="text-sm text-gray-700 dark:text-gray-400">Escrow Balance</h2>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                        ₹{escrowAmount?.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Total revenue */}
                            {revenue !== null && (
                                <div className="bg-gray-200 dark:bg-zinc-800 rounded-xl shadow-md p-6 flex items-center gap-4 w-full sm:w-64 h-24">
                                    <div className="p-3 text-red-600 dark:text-red-300 rounded-full">
                                        💰
                                    </div>
                                    <div>
                                        <h2 className="text-sm text-gray-700 dark:text-gray-400">Total Revenue</h2>
                                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                            ₹{revenue.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Total Clients */}
                            <div className="bg-gray-200 dark:bg-zinc-800 rounded-xl shadow-md p-6 flex items-center gap-4 w-full sm:w-64 h-24">
                                <div className="p-3 text-blue-600 rounded-full">
                                    <FaUserTie size={28} />
                                </div>
                                <div>
                                    <h2 className="text-sm text-gray-700 dark:text-gray-400">Total Clients</h2>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                        {clientCount}
                                    </p>
                                </div>
                            </div>

                            {/* Total Freelancers */}
                            <div className="bg-gray-200 dark:bg-zinc-800 rounded-xl shadow-md p-6 flex items-center gap-4 w-full sm:w-64 h-24">
                                <div className="p-3 text-purple-600 rounded-full">
                                    <GrUserWorker size={28} />
                                </div>
                                <div>
                                    <h2 className="text-sm text-gray-700 dark:text-gray-400">Total Freelancers</h2>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                        {freelancerCount}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
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

export default Dashboard;