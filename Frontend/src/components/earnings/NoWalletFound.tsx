import { useNavigate } from "react-router-dom";
import { ArrowLeft, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

const NoWalletData = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center text-center gap-4 py-16 px-4">
            <div className="flex items-center gap-4">
                <Wallet className="w-14 h-14 text-gray-400 dark:text-gray-500" />
            </div>

            <p className="text-md font-normal text-gray-600 dark:text-gray-300 text-center">
                No wallet data found. If you've completed a project or received a payment,<br />
                your wallet will be shown here.
            </p>

            <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="mt-4 flex items-center gap-2"
            >
                <ArrowLeft className="w-4 h-4" />
                Go Back
            </Button>
        </div>
    );
};

export default NoWalletData;