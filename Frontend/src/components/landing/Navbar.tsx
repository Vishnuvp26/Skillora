import { useContext, useState } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { LogIn, UserPlus, Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoWhite from '../../assets/Logo white.png'
import logoBlack from '../../assets/Logo black.png'
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {

    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme, toggleTheme } = themeContext;

    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

    const navigate = useNavigate();

    return (
        <>
            {/* Navbar */}
            <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-800 z-50">
                <div>
                    <img 
                        src={theme === "dark" ? logoWhite : logoBlack} 
                        alt="Brand Logo" 
                        className="h-9" 
                        onClick={() => navigate("/")}
                    />
                </div>

                {/* Center: Navigation Links (Hidden on Mobile) */}
                <div className="hidden lg:flex gap-6 text-gray-900 dark:text-gray-300">
                    <Button onClick={() => navigate("/")}  variant="ghost">Home</Button>
                    <Button onClick={() => navigate("/login")} variant="ghost">Find Talent</Button>
                    <Button onClick={() => navigate("/login")} variant="ghost">Find Work</Button>
                    <Button onClick={() => navigate("")} variant="ghost">About Us</Button>
                </div>

                {/* Right: Login, Signup, and Dark Mode Toggle (Desktop Only) */}
                <div className="hidden lg:flex gap-4">
                    <Button variant="ghost" onClick={toggleTheme}>
                        {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </Button>
                    <Button onClick={() => navigate("/login")} variant="ghost">
                        <LogIn className="w-4 h-4 mr-2" /> Login
                    </Button>
                    <Button onClick={() => navigate("/select-role")} variant="ghost">
                        <UserPlus className="w-4 h-4 mr-2" /> Signup
                    </Button>
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
                className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 z-50 p-6 flex flex-col gap-4 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                {/* Close Button */}
                <Button variant="ghost" className="self-end" onClick={() => setIsSidebarOpen(false)}>
                    <X className="w-6 h-6" />
                </Button>

                {/* Sidebar Links */}
                <Button variant="ghost">Home</Button>
                <Button variant="ghost">Find Talent</Button>
                <Button variant="ghost">Find Work</Button>
                <Button variant="ghost">About Us</Button>

                {/* Dark Mode Toggle */}
                <Button variant="ghost" onClick={toggleTheme}>
                    {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </Button>

                {/* Mobile Login & Signup */}
                <Button variant="ghost" onClick={() => navigate("/login")}>
                    <LogIn className="w-4 h-4 mr-2" /> Login
                </Button>
                <Button variant="ghost"  onClick={() => navigate("/select-role")}>
                    <UserPlus className="w-4 h-4 mr-2" /> Signup
                </Button>
            </div>
        </>
    );
};

export default Navbar;