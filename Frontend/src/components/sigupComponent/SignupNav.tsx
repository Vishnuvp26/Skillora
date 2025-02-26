import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoWhite from "../../assets/Logo white.png";
import logoBlack from "../../assets/Logo black.png";
import { useNavigate } from "react-router-dom";

const SignUpNav: React.FC = () => {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme, toggleTheme } = themeContext;

    const navigate = useNavigate();

    return (
        <>
            <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-800 z-50">
                <div>
                    <img 
                        src={theme === "dark" ? logoWhite : logoBlack} 
                        alt="Brand Logo" 
                        className="h-9"
                        onClick={() => navigate("/")} 
                    />
                </div>

                <Button variant="ghost" onClick={toggleTheme}>
                    {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </Button>
            </nav>
        </>
    );
};

export default SignUpNav;