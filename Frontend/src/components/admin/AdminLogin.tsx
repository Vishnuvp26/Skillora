import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

const AdminLogin = () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex min-h-screen">
            {/* Left Side - Hidden on Mobile */}
            <div className="hidden md:flex w-1/2 items-center justify-center bg-cyan-800 text-white p-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">Welcome to Skillora Admin</h2>
                    <p className="text-lg">Manage your platform efficiently and securely.</p>
                    {/* <img 
                        src="/images/admin-banner.png" 
                        alt="Admin Dashboard" 
                        className="mt-6 w-3/4 mx-auto"
                    /> */}
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <h2 className="text-center text-2xl font-bold mb-6">Skillora Admin</h2>
                    <form>
                        <div className="mb-4">
                            <Label htmlFor="email">Email</Label>
                            <Input type="email" id="email" placeholder="Enter your email" required />
                        </div>
                        <div className="mb-4 relative">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                            Login
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;