import { useEffect, useState } from "react";
import LoginNav from "../login/LoginNav";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPasswordWithToken } from "@/api/auth/authApi";
import toast from "react-hot-toast";

const NewPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState({
        new: false,
        confirm: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    useEffect(() => {
        if (!token) {
            navigate("/forgot-password");
        }
    }, [token, navigate]);

    const togglePasswordVisibility = (field: "new" | "confirm") => {
        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            setError("Both fields are required");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await resetPasswordWithToken(token as string, password, confirmPassword);
            toast.success(response.message);
            setTimeout(() => navigate("/login"), 2000);
        } catch (error: any) {
            setError(error?.error || "Failed to reset password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-950">
            <LoginNav />
            <Card className="w-full max-w-lg p-8 rounded-xl dark:bg-gray-950 bg-gray-50 shadow-none border-none">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-semibold text-gray-800 dark:text-white">
                        Reset Password
                    </CardTitle>
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Enter your new password below.
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* New Password */}
                        <div className="relative flex flex-col mb-4">
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword.new ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError(null);
                                    }}
                                    placeholder="Enter new password"
                                    className={`h-12 px-5 pr-12 rounded-lg border ${
                                        error ? "border-red-500" : "border-gray-400 dark:border-gray-700"
                                    } bg-gray-100 dark:bg-gray-900`}
                                />
                                <span
                                    className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-gray-600 dark:text-gray-400"
                                    onClick={() => togglePasswordVisibility("new")}
                                >
                                    {showPassword.new ? <EyeOff size={20} /> : <Eye size={20} />}
                                </span>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="relative flex flex-col mb-4">
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showPassword.confirm ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        setError(null);
                                    }}
                                    placeholder="Confirm new password"
                                    className={`h-12 px-5 pr-12 rounded-lg border ${
                                        error ? "border-red-500" : "border-gray-400 dark:border-gray-700"
                                    } bg-gray-100 dark:bg-gray-900`}
                                />
                                <span
                                    className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-gray-600 dark:text-gray-400"
                                    onClick={() => togglePasswordVisibility("confirm")}
                                >
                                    {showPassword.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                </span>
                            </div>
                        </div>

                        {error && (
                            <p className="text-sm font-semibold text-red-500 text-center">{error}</p>
                        )}
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 rounded-lg flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Resetting password...
                                </>
                            ) : (
                                "Reset Password"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default NewPassword;