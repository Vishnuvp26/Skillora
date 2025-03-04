import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useState } from "react";
import useMobile from "@/hooks/useMobile";

const Skills = () => {
    const isMobile = useMobile();
    const [isCollapsed, setIsCollapsed] = useState(isMobile);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

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
                    {/* Your page content goes here */}
                    <h1 className="text-gray-900 dark:text-white text-xl font-semibold mb-4">Skills</h1>
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

export default Skills;