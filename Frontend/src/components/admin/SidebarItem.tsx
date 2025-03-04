import { NavLink } from "react-router-dom";

interface SidebarItemProps {
    to: string;
    icon: React.ReactNode;
    label: string;
    className?: string;
    isCollapsed: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
    to, 
    icon, 
    label, 
    className = "", 
    isCollapsed 
}) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) => 
                `flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} 
                p-3 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-emerald-500 dark:hover:text-emerald-400 
                rounded-md transition-all duration-200 group ${className} 
                ${isActive ? 'bg-gray-300 dark:bg-zinc-800 text-emerald-500 dark:text-emerald-400' : ''}`
            }
        >
            {icon}
            {!isCollapsed && <span className="text-sm font-medium">{label}</span>}
            
            {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-100 dark:bg-zinc-800 
                    text-gray-900 dark:text-white text-sm rounded opacity-0 group-hover:opacity-100 
                    transition-opacity whitespace-nowrap z-50">
                    {label}
                </div>
            )}
        </NavLink>
    );
};

export default SidebarItem;