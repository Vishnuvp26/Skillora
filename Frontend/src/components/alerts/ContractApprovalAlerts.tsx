import Marquee from "react-fast-marquee";

export const ContractApprovalMarquee = () => {
    return (
        <div className="bg-yellow-50 dark:bg-gray-900 text-yellow-800 dark:text-yellow-300 py-2 px-4 rounded mb-4 text-xs font-semibold">
            <Marquee pauseOnHover speed={50} gradient={false}>
                Your contract is pending approval! The freelancer must accept it before you can proceed. Please wait for confirmation.
            </Marquee>
        </div>
    );
};  