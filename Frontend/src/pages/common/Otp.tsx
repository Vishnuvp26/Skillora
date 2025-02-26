import { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SignUpNav from "@/components/sigupComponent/SignupNav";

const Otp = () => {
    const [otp, setOtp] = useState<string>("");

    const handleSubmit = () => {
        console.log("OTP Submitted:", otp);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 px-4 py-12">
            <SignUpNav/>
            <Card className="w-full max-w-lg bg-gray-100 dark:bg-gray-950 shadow-lg rounded-lg p-6">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold text-gray-900 dark:text-white">
                        One-Time Password
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-gray-700 dark:text-gray-300 mb-4">
                        Please enter the one-time password sent to your mail.
                    </p>
                    <div className="flex justify-center">
                        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                            <InputOTPGroup>
                                {[...Array(6)].map((_, index) => (
                                    <InputOTPSlot key={index} index={index} className="w-10 h-12 text-lg border border-gray-300 dark:border-gray-600 focus:ring-[#0077B6] dark:focus:ring-[#00FFE5]" />
                                ))}
                            </InputOTPGroup>
                        </InputOTP>
                    </div>
                    <Button onClick={handleSubmit} className="w-full mt-4 bg-[#0077B6] dark:bg-[#00FFE5] text-white dark:text-black font-semibold rounded-lg hover:bg-[#005A8E] dark:hover:bg-[#00BFA5] transition">
                        Submit
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default Otp; 