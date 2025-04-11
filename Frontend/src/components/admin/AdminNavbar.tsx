import { Bell, Settings, User, Menu, LogOut, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ThemeContext } from "@/context/ThemeContext";
import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/api/auth/authApi";
import { removeUser } from "@/redux/authSlice";
import { fetchAllContracts } from "@/api/admin/contractApi";

interface NavbarProps {
    toggleSidebar: () => void;
}

const AdminNavbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {

    const [contracts, setContracts] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [hasRequests, setHasRequests] = useState(false);

    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme, toggleTheme } = themeContext;

    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchContracts = async () => {
            try {
                const res = await fetchAllContracts();
                const requestedContracts = res.data.filter(
                    (contract: any) => contract.releaseFundStatus === "Requested"
                );
                setContracts(requestedContracts);
                setHasRequests(requestedContracts.length > 0);
            } catch (error) {
                console.error("Error fetching contracts:", error);
            }
        };
    
        fetchContracts();
    }, []);
    
    const handleViewContract = (contractId: string) => {
        navigate(`/admin/contracts/${contractId}`);
    };

    const handleLogout = async () => {
        try {
            await logoutUser();
            dispatch(removeUser())
            navigate('/admin/login')
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <nav className="bg-gray-200 dark:bg-black border-b border-zinc-200 dark:border-zinc-800 p-4">
            <div className="flex items-center justify-between">
                {/* Mobile Menu Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-gray-500 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400"
                    onClick={toggleSidebar}
                >
                    <Menu size={20} />
                </Button>

                {/* Right Side Items */}
                <div className="flex items-center gap-4 ml-auto">
                    <Button variant="ghost" onClick={toggleTheme}>
                        {theme === "light" ? <Moon className="w-5 h-5 text-gray-500 dark:text-gray-400" /> : <Sun className="w-5 h-5 text-gray-500 dark:text-gray-400" />}
                    </Button>
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-500 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400"
                            onClick={() => setShowNotifications((prev) => !prev)}
                        >
                            <Bell size={20} />
                            {hasRequests && (
                                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
                            )}
                        </Button>

                        {/* Dropdown notification */}
                        {showNotifications && (
                            <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
                                <DropdownMenuTrigger asChild>
                                    <span></span>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-80 max-h-72 overflow-y-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md z-50"
                                    sideOffset={10}
                                    side="bottom"
                                    forceMount
                                >
                                    {contracts.length > 0 && (
                                        <DropdownMenuLabel className="p-3 text-sm font-medium border-b border-zinc-200 dark:border-zinc-800">
                                            Fund Release Requests
                                        </DropdownMenuLabel>
                                    )}

                                    {contracts.length > 0 ? (
                                        contracts.map((contract: any) => (
                                            <DropdownMenuItem
                                                key={contract._id}
                                                onClick={() => handleViewContract(contract._id)}
                                                className="flex flex-col items-start p-3 text-left hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer border-b border-zinc-100 dark:border-zinc-800"
                                            >
                                                <div className="font-semibold text-gray-900 dark:text-white text-sm">
                                                    Contract ID: {contract.contractId}
                                                </div>
                                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                                    Client <span className="font-medium">{contract.clientId?.name}</span> has requested to release funds.
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    Freelancer: {contract.freelancerId?.name}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    Requested at: {new Date(contract.updatedAt).toLocaleDateString()}
                                                </div>
                                            </DropdownMenuItem>
                                        ))
                                    ) : (
                                        <DropdownMenuItem className="p-3 text-gray-500 dark:text-gray-400 text-sm">
                                            No notifications yet.
                                        </DropdownMenuItem>
                                    )}

                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                    <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400">
                        <Settings size={20} />
                    </Button>
                    
                    {/* Admin Profile Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-emerald-500 dark:hover:text-emerald-400">
                                <User size={20} />
                                <span className="hidden md:inline">Admin</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                            <DropdownMenuItem onClick={handleLogout} className="text-red-500 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer">
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;