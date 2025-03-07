import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUser } from "@/api/auth/authApi";
import { setUser } from "@/redux/authSlice";

const AdminLogin = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || !password) {
            toast.error('Enter credentials')
            return
        }
        setLoading(true)
        setError("")

        try {
            const response = await loginUser(email, password);
            console.log('Admin Login Response :', response)
            dispatch(setUser({
                _id: response.user?.id || "",
                email: response.user?.email || "",
                role: response.role || "",
                status: response.user?.status || "",
                profilePic: response.user?.profilePic || "",
                accessToken: response.accessToken || null,
                name: response.user?.name || "",
            }))
            if (response.role === "admin") {
                navigate('/admin/dashboard')
            } else {
                navigate('/')
            }
        } catch (error: any) {
            setError(error.error || 'Admin login failed')
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="flex min-h-screen">
            <div className="hidden md:flex w-1/2 items-center justify-center bg-gray-900 text-white p-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4 dark:bg-gradient-to-r dark:from-emerald-400 dark:to-cyan-400 dark:bg-clip-text dark:text-transparent">Welcome to Skillora Admin</h2>
                    <p className="text-lg">Manage your platform efficiently and securely.</p>
                </div>
            </div>

            <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-slate-600 text-white">
                <div className="w-full max-w-md">
                    <h2 className="text-center text-2xl font-bold mb-6">Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                type="email"
                                id="email"
                                placeholder="Enter your email"
                                className="bg-gray-800 text-white"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-4 relative">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="Enter your password"
                                    className="bg-gray-800 text-white"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                            </div>
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white" type="submit" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;