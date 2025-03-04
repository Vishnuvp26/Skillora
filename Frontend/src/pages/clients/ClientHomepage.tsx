import ClientNav from '@/components/client/ClientNav';
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";

const ClientHomepage = () => {
    return (
        <div className="min-h-screen  dark:bg-gray-950">
            {/* Navbar */}
            <ClientNav />

            {/* Header Section */}
            <div className="flex justify-between items-center p-6 mt-20">
                <h1 className="text-2xl font-semibold">
                    <span className="text-black dark:text-white">Welcome,</span>
                    <span className="text-[#0077B6] dark:text-[#00FFE5]"> Vishnu</span>
                </h1>

                <Button className="bg-[#0077B6] dark:bg-[#00FFE5] hover:bg-[#005f8c] dark:hover:bg-[#00d4c0] text-white dark:text-black px-4 py-2 rounded-lg">
                    + Post Job
                </Button>

            </div>

            {/* Overview Section */}
            <div className="px-6 mt-10">
                <h2 className="text-xl font-semibold">Overview</h2>
                <div className="p-10 mt-4 flex flex-col items-center text-center bg-white dark:bg-gray-950">
                    <Briefcase size={50} className="text-gray-500" />
                    <p className="text-gray-600 mt-4">
                        No job posts or contracts in progress right now
                    </p>
                    <Button className="bg-[#0077B6] hover:bg-[#005f8c] text-white px-4 py-2 mt-4 rounded-lg 
                        dark:bg-transparent dark:border dark:border-[#00FFE5] dark:text-[#00FFE5] 
                        dark:hover:bg-[#00FFE511]">
                        + Post a Job
                    </Button>

                </div>
            </div>
        </div>
    );
};

export default ClientHomepage;