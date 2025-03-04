import { Bell, Settings, User, Menu, LogOut, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeContext } from "@/context/ThemeContext";
import { useContext } from "react";

interface NavbarProps {
    toggleSidebar: () => void;
}

const AdminNavbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {

    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme, toggleTheme } = themeContext;

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
                    <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400">
                        <Bell size={20} />
                    </Button>
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
                            <DropdownMenuItem className="text-red-500 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer">
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