import { useState } from "react";
import { motion } from "framer-motion";
import { FaGoogle } from "react-icons/fa";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "@/api/authApi";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import toast from "react-hot-toast";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
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
            console.log("API login Response:", response); 
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
                navigate("/dashboard");
            }
        } catch (err: any) {
            setError(err.error || "Login failed");
        } finally {
            setLoading(false);
        }
    }; 

    return (
        <div className="flex items-center justify-center min-h-[92vh] mt-[80px] sm:mt-[40px] md:mt-16 lg:mt-14">
            <motion.div
                className="w-[90%] sm:w-[400px] min-h-[500px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }}
            >
                <Card className="min-h-[530px]">
                    <CardHeader>
                        <CardTitle className="text-center">Login</CardTitle>
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
                                <a href="#" className="text-sm text-[#0077B6] dark:text-[#00FFE5] hover:underline">
                                    Forgot password?
                                </a>
                            </div>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <Button className="w-full h-12" type="submit" disabled={loading}>
                                {loading ? "Logging in..." : "Login"}
                            </Button>
                        </form>

                        <div className="flex items-center my-6">
                            <hr className="flex-grow border-gray-300 dark:border-gray-600" />
                            <span className="px-2 text-gray-500 dark:text-gray-400">OR</span>
                            <hr className="flex-grow border-gray-300 dark:border-gray-600" />
                        </div>
                        <Button variant="outline" className="w-full flex items-center justify-center h-12">
                            <FaGoogle className="w-5 h-5 mr-2" />
                            Continue with Google
                        </Button>
                        <p className="mt-6 text-center text-sm text-gray-700 dark:text-gray-300">
                            Don’t have an account?
                            <Link to="/select-role" className="text-[#0077B6] dark:text-[#00FFE5] font-medium hover:underline"> Sign up</Link>
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default LoginForm;