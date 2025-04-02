import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const PaymentSuccess = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-950 w-full px-4 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4 animate-bounce" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 animate-fade-in">Payment Successful!</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-md animate-fade-in">
                Thank you for your payment. Your contract has been started. 
            </p>
            <Link to="/client/contracts" className="mt-4 text-blue-500 hover:underline">Click to view</Link>
        </div>
    );
};

export default PaymentSuccess;