import { Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "../ui/breadcrumb";

interface BreadcrumbsProps {
    items: { label: string; path?: string }[];
    children?: React.ReactNode; // Make children optional
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, children }) => {
    return (
        <div className="p-5 mt-16 max-w-6xl mx-auto">
            <Breadcrumb className="mb-6">
                <BreadcrumbList>
                    {items.map((item, index) => (
                        <BreadcrumbItem key={index}>
                            {item.path ? (
                                <Link
                                    to={item.path}
                                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="text-gray-500 dark:text-gray-400">{item.label}</span>
                            )}
                            {index < items.length - 1 && <BreadcrumbSeparator />}
                        </BreadcrumbItem>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
            {children && <div>{children}</div>}
        </div>
    );
};

export default Breadcrumbs;