import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { Menu, X, Sun, Moon, User, Settings, LogOut, DollarSign, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import logoWhite from '../../assets/Logo white.png';
import logoBlack from '../../assets/Logo black.png';
import { logoutUser } from "@/api/auth/authApi";
import { removeUser } from "@/redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/redux/store/store";
import { useLocation } from "react-router-dom";

const ClientNav: React.FC = () => {
    
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme, toggleTheme } = themeContext;

    const userName = useSelector((state: RootState) => state.user.name);
    const userRole = useSelector((state: RootState) => state.user.role)

    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutUser();
            dispatch(removeUser());
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };
    
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    return (
        <>
            {/* Navbar */}
            <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-800 z-50">
                {/* Logo */}
                <div>
                    <img
                        src={theme === "dark" ? logoWhite : logoBlack}
                        alt="Brand Logo"
                        className="h-9"
                        onClick={() => navigate('/client/home')}
                    />
                </div>

                {/* Navigation Links (Hidden on Mobile) */}
                <div className="hidden lg:flex gap-6 text-gray-900 dark:text-gray-50">
                    <Button
                        variant="ghost"
                        onClick={() => navigate("/client/home")}
                        className={location.pathname === "/client/home" ? "text-[#0077B6] dark:bg-gradient-to-r dark:from-emerald-400 dark:to-cyan-400 dark:bg-clip-text dark:text-transparent" : ""}
                    >
                        Home
                    </Button>
                    {/* find work */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-2">
                                Hire Talent <ChevronDown className="w-4 h-4 text-gray-900 dark:text-gray-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-40 bg-white dark:bg-gray-900 shadow-lg rounded-md p-2">
                            <DropdownMenuItem onClick={() => navigate('/client/post-job')} className="hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-md cursor-pointer">
                                Post Work
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {/* deliver work */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-2">
                                Manage Work <ChevronDown className="w-4 h-4 text-gray-900 dark:text-gray-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-40 bg-white dark:bg-gray-900 shadow-lg rounded-md p-2">
                            <DropdownMenuItem onClick={() => navigate('/client/contracts')} className="hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-md cursor-pointer">
                                Active Contract
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate('/client/home')} className="hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-md cursor-pointer">
                                My Works
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                        onClick={() => navigate('/client/messages')}
                        variant="ghost"
                        className={location.pathname === "/client/messages" ? "text-[#0077B6] dark:bg-gradient-to-r dark:from-emerald-400 dark:to-cyan-400 dark:bg-clip-text dark:text-transparent" : ""}
                    >
                        Messages
                    </Button>
                </div>

                {/* Right Side: Dark Mode & Profile Dropdown */}
                <div className="hidden lg:flex gap-4 items-center">
                    {/* Dark Mode Toggle */}
                    <Button variant="ghost">
                        <Bell className="w-5 h-5" />
                    </Button>

                    <Button variant="ghost" onClick={toggleTheme}>
                        {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </Button>

                    {/* Profile Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-2">
                                <User className="w-5 h-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-gray-900 shadow-lg rounded-md p-2">
            
                            {/* User Info Section */}
                            <div className="flex items-center gap-3 p-3 border-b border-gray-200 dark:border-gray-700">
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{userName}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{userRole}</p>
                                </div>
                            </div>

                            {/* Profile & Logout Options */}
                            <DropdownMenuItem onClick={() => navigate("/client/profile")}>
                                <User className="w-4 h-4 mr-2" /> Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate('/client/earnings')}>
                                <DollarSign className="w-4 h-4 mr-2" /> Earnings
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate("/client/profile-settings")}>
                                <Settings className="w-4 h-4 mr-2" /> Profile Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                                <LogOut className="w-4 h-4 mr-2" /> Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Mobile: Hamburger Menu */}
                <Button
                    variant="ghost"
                    className="lg:hidden"
                    onClick={() => setIsSidebarOpen(true)}
                >
                    <Menu className="w-6 h-6" />
                </Button>
            </nav>

            {/* Mobile Sidebar */}
            <div
                className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
                onClick={() => setIsSidebarOpen(false)}
            ></div>

            <div
                className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 z-50 p-6 flex flex-col gap-4 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Close Button */}
                <Button variant="ghost" className="self-end" onClick={() => setIsSidebarOpen(false)}>
                    <X className="w-6 h-6" />
                </Button>

                {/* Sidebar Links */}
                <Button variant="ghost" onClick={() => navigate("/client/home")}>Home</Button>

                {/* Find Work (Dropdown) */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2">
                            Hire Talent <ChevronDown className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-40 bg-white dark:bg-gray-900 shadow-lg rounded-md p-2">
                        <DropdownMenuItem>
                            Post Job
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Deliver Work (Dropdown) */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2">
                            Manage Work <ChevronDown className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-40 bg-white dark:bg-gray-900 shadow-lg rounded-md p-2">
                        <DropdownMenuItem onClick={() => navigate('/client/contracts')}>
                            Active Contract
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/client/home')}>
                            My Jobs
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button onClick={() => navigate('/client/messages')} variant="ghost">Messages</Button>

                {/* Dark Mode Toggle */}
                <Button variant="ghost" onClick={toggleTheme}>
                    {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </Button>

                {/* Profile Dropdown (For Mobile) */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-gray-900 shadow-lg rounded-md p-2">
            
                        {/* User Info Section */}
                        <div className="flex items-center p-3 border-b border-gray-200 dark:border-gray-700">
                        </div>

                        {/* Profile & Logout Options */}
                        <DropdownMenuItem onClick={() => navigate("/client/profile")}>
                            <User className="w-4 h-4 mr-2" /> Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/client/earnings')}>
                            <DollarSign className="w-4 h-4 mr-2" /> Earnings
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate("/client/profile-settings")}>
                            <Settings className="w-4 h-4 mr-2" /> Profile Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                            <LogOut className="w-4 h-4 mr-2" /> Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </>
    );
};

export default ClientNav;