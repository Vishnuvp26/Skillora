import { useState } from "react";
import { motion } from "framer-motion";
import googleIcon from '../../assets/google.svg'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { googleLogin, loginUser } from "@/api/auth/authApi";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { GoogleLogin } from "@react-oauth/google";
import loginImage from '../../assets/test3.png'
import { Loader2 } from "lucide-react";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState<"client" | "freelancer" | null>(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error('Enter credentials')
            return
        }
        setLoading(true);
        setError("");
    
        try {
            const response = await loginUser(email, password);
            dispatch(setUser({
                _id: response.user?.id || "",
                email: response.user?.email || "",
                role: response.role || "",
                status: response.user?.status || "",
                profilePic: response.user?.profilePic || "",
                accessToken: response.accessToken || null,
                name: response.user?.name || "",
            }));
    
            if (response.role === "client") {
                navigate("/client/home");
            } else if (response.role === "freelancer") {
                navigate("/freelancer/home");
            } else {
                toast.error('No access')
            }
        } catch (err: any) {
            setError(err.error || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async (credentialResponse: any) => {
        if (!selectedRole) {
            toast.error("Please select a role before logging in.");
            return;
        }

        try {
            const token = credentialResponse.credential;
            const response = await googleLogin(token, selectedRole);

            dispatch(setUser({
                _id: response.user.id,
                email: response.user.email,
                role: response.role,
                status: response.status,
                profilePic: response.user.profilePic || "",
                accessToken: response.accessToken,
                name: response.user.name,
            }));

            if (response.role === "client") {
                navigate("/client/home");
            } else if (response.role === "freelancer") {
                navigate("/freelancer/home");
            }
        } catch (error: any) {
            toast.error(error.error);
        }
    };

    return (
        <div className="flex flex-col md:flex-row items-center justify-center min-h-screen dark:bg-gray-950 bg-white gap-4 md:gap-0">
            {/* Left Side - Image */}
            <div className="hidden md:flex w-full md:w-1/2 h-full items-center justify-center">
                <img src={loginImage} alt="Login illustration" className="max-w-full max-h-full object-contain" />
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-6">
                <motion.div
                    className="w-full max-w-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }}
                >
                    <Card className="shadow-none border-none">
                        <CardHeader>
                            <CardTitle className="text-center text-2xl font-medium">Login</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    className="h-12"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Input
                                    type="password"
                                    placeholder="Enter your password"
                                    className="h-12"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <div className="text-right">
                                    <Link
                                        to="/forgot-password"
                                        className="text-sm text-[#0077B6] dark:text-[#00FFE5] hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                                <Button
                                    className="w-full h-12 flex items-center justify-center gap-2"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin w-5 h-5" />
                                            Please wait...
                                        </>
                                    ) : (
                                        "Login"
                                    )}
                                </Button>
                            </form>
                            
                            <div className="flex items-center my-6">
                                <hr className="flex-grow border-gray-300 dark:border-gray-600" />
                                <span className="px-2 text-gray-500 dark:text-gray-400">OR</span>
                                <hr className="flex-grow border-gray-300 dark:border-gray-600" />
                            </div>
                            <Dialog open={showRoleModal} onOpenChange={setShowRoleModal}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full flex items-center justify-center h-12">
                                        <img src={googleIcon} alt="Google" className="w-5 h-5 mr-2" />
                                        Continue with Google
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-[90%] sm:max-w-md mx-auto p-4">
                                    <DialogHeader>
                                        <DialogTitle className="text-center">Select Your Role</DialogTitle>
                                    </DialogHeader>
                                    <RadioGroup onValueChange={(value) => setSelectedRole(value as "client" | "freelancer")}>
                                        <div className="flex justify-between p-4">
                                            <label className="flex items-center gap-2">
                                                <RadioGroupItem value="client" />
                                                Client
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <RadioGroupItem value="freelancer" />
                                                Freelancer
                                            </label>
                                        </div>
                                    </RadioGroup>
                                    {selectedRole && (
                                        <GoogleLogin onSuccess={handleGoogleLogin} onError={() => toast.error("Google Login Failed")} />
                                    )}
                                </DialogContent>
                            </Dialog>
                            <p className="mt-6 text-center text-sm text-gray-700 dark:text-gray-300">
                                Don’t have an account?
                                <Link to="/select-role" className="text-[#0077B6] dark:text-[#00FFE5] font-medium hover:underline"> Sign up</Link>
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default LoginForm;