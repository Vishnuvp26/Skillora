import { useState } from "react";
import LoginNav from "../login/LoginNav";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { forgotPassword } from "@/api/auth/authApi";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const ForgotPass = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) return toast.error('Email is required')
    
        setLoading(true);
        setError(null);
    
        try {
            await forgotPassword(email);
            toast.success(`Password reset link sent to your mail`);
            setEmail('')
        } catch (error: any) {
            setError(error?.error || "Something went wrong");
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
                        Forgot Password
                    </CardTitle>
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Enter your registered email address, and we'll send you a link to reset your password.
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="email"
                                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Email Address
                            </label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError(null);
                                }}
                                placeholder={error ? error : "you@example.com"}
                                className={`h-12 px-5 rounded-lg border ${error ? "border-red-500 placeholder-red-500" : "border-gray-400 dark:border-gray-700"
                                    } bg-gray-100 dark:bg-gray-900`}
                            />
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
                                    Sending reset link...
                                </>
                            ) : (
                                "Send Reset Link"
                            )}
                        </Button>
                        <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
                            Remembered your password?{" "}
                            <Link
                                to="/login"
                                className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                            >
                                Login
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ForgotPass;