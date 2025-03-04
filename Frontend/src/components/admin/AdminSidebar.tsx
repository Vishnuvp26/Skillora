import { 
    LayoutDashboard, 
    Users, 
    UserCog, 
    Wallet, 
    Briefcase, 
    FileText,
    LogOut,
    ChevronLeft,
    ChevronRight,
    SearchCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SidebarItem from "./SidebarItem";

interface AdminSidebarProps {
    isCollapsed: boolean;
    toggleSidebar: () => void;
    isMobile: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
    isCollapsed,
    toggleSidebar,
    isMobile
}) => {
    return (
        <aside className={`${isCollapsed ? 'w-20' : 'w-64'} 
            bg-gray-200 dark:bg-black border-r border-zinc-200 dark:border-zinc-800 transition-all duration-300 
            fixed md:relative h-screen z-20`}>
            
            {/* Logo Section */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">S</span>
                    </div>
                    {!isCollapsed && (
                        <span className="font-bold text-[#111111] dark:bg-gradient-to-r dark:from-emerald-400 dark:to-cyan-400 dark:bg-clip-text dark:text-transparent">
                            SKILLORA
                        </span>
                    
                    )}
                </div>
                {!isMobile && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleSidebar}
                        className="text-gray-500 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400"
                    >
                        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </Button>
                )}
            </div>

            {/* Menu Items */}
            <div className="p-4 space-y-2">
                <SidebarItem
                    to="/admin/dashboard"
                    icon={<LayoutDashboard size={20} />}
                    label="Dashboard"
                    isCollapsed={isCollapsed}
                />
                
                <SidebarItem
                    to="/admin/clients"
                    icon={<Users size={20} />}
                    label="Clients"
                    isCollapsed={isCollapsed}
                />
                
                <SidebarItem
                    to="/admin/freelancers"
                    icon={<UserCog size={20} />}
                    label="Freelancers"
                    isCollapsed={isCollapsed}
                />
                
                <SidebarItem
                    to="/admin/contracts"
                    icon={<FileText size={20} />}
                    label="Contracts"
                    isCollapsed={isCollapsed}
                />
                
                <SidebarItem
                    to="/admin/payments"
                    icon={<Wallet size={20} />}
                    label="Payments"
                    isCollapsed={isCollapsed}
                />
                
                <SidebarItem
                    to="/admin/job-categories"
                    icon={<Briefcase size={20} />}
                    label="Job Categories"
                    isCollapsed={isCollapsed}
                />
                
                <SidebarItem
                    to="/admin/skills"
                    icon={<SearchCheck size={20} />}
                    label="Skills"
                    isCollapsed={isCollapsed}
                />

                <SidebarItem
                    to="/logout"
                    icon={<LogOut size={20} />}
                    label="Logout"
                    className="text-red-500 dark:text-red-400 hover:bg-red-500/10 dark:hover:bg-red-400/10 hover:text-red-500 dark:hover:text-red-300 mt-8"
                    isCollapsed={isCollapsed}
                />
            </div>
        </aside>
    );
};

export default AdminSidebar;