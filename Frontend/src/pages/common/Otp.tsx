import { useEffect, useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SignUpNav from "@/components/signup/SignupNav";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp, resendOtp } from "@/api/auth/authApi";
import { toast } from "react-hot-toast";

const Otp = () => {
    const [otp, setOtp] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [timer, setTimer] = useState<number>(60);
    const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);

    const location = useLocation();
    const navigate = useNavigate();

    const email = location.state?.email;
    const userData = location.state?.userData;

    useEffect(() => {
        if (!email || !userData) {
            navigate("/signup", { replace: true });
        }
    }, [email, userData, navigate]);

    useEffect(() => {
        let countdown: NodeJS.Timeout;
        if (timer > 0) {
            countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
        } else {
            setIsResendDisabled(false);
        }
        return () => clearInterval(countdown);
    }, [timer]);

    const handleSubmit = async () => {
        try {
            console.log(`Sending OTP: ${otp} for email: ${email}`);
            console.log("Final userData before API call:", userData);
            setError(null);
            await verifyOtp(email, otp, userData);
            toast.success("OTP verified successfully");
            navigate("/login");
        } catch (error: any) {
            console.log("OTP submit error:", error.response?.data);
            setError(error.error || "Something went wrong");
        }
    };

    const handleResendOtp = async () => {
        try {
            setIsResendDisabled(true);
            setTimer(60);
            await resendOtp(email);
            toast.success("OTP resent successfully");
            setOtp('')
            setError('')
        } catch (error: any) {
            toast.error(error.error);
        }
    };  

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 px-4 py-12">
            <SignUpNav />
            <Card className="w-full max-w-lg bg-gray-10 dark:bg-gray-950 rounded-lg p-6 shadow-none border-none">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold text-gray-900 dark:text-white">
                        One-Time Password
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-gray-700 dark:text-gray-300 mb-4">
                        Please enter the one-time password sent to your mail {email}.
                    </p>
                    <div className="flex justify-center">
                        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                            <InputOTPGroup>
                                {[...Array(6)].map((_, index) => (
                                    <InputOTPSlot
                                        key={index}
                                        index={index}
                                        className="w-10 h-12 text-lg border border-gray-300 dark:border-gray-600 focus:ring-[#0077B6] dark:focus:ring-[#00FFE5]"
                                    />
                                ))}
                            </InputOTPGroup>
                        </InputOTP>
                    </div>
                    {error && <p className="text-sm text-red-500 text-center mt-2">{error}</p>}
                    <Button
                        onClick={handleSubmit}
                        disabled={otp.length !== 6}
                        className="w-full mt-4 bg-[#0077B6] dark:bg-[#00FFE5] text-white dark:text-black font-semibold rounded-lg hover:bg-[#005A8E] dark:hover:bg-[#00BFA5] transition"
                    >
                        Submit
                    </Button>
                    <div className="text-center mt-4">
                        {isResendDisabled ? (
                            <p className="text-xs text-gray-600 dark:text-gray-400">Resend OTP in {timer}s</p>
                        ) : (
                            <Button
                                onClick={handleResendOtp}
                                variant="outline"
                                className="w-full mt-2 rounded-lg"
                            >
                                Resend OTP
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Otp;