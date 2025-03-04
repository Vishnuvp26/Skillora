import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {FormData} from '../../types/Types'
import { registerUser } from "@/api/authApi";

const SignUpForm = () => {
    
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: ""
    })

    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    const navigate = useNavigate()

    useEffect(() => {
        const storedRole = localStorage.getItem('userRole')
        if (storedRole) {
            setFormData((prev) => ({ ...prev, role: storedRole }))
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            toast.error("All fields are required");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error('password do not match')
            return
        }
        try {
            setLoading(true)
            await registerUser({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role
            });
            alert('OTP sent to your mail')
            navigate("/otp", { state: { email: formData.email, userData: formData } });
        } catch (error: any) {
            setError(error.error || "Something went wrong, please try again");
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[90vh] mt-[80px] sm:mt-[40px] md:mt-16 lg:mt-14">
            <motion.div
                className="w-[90%] sm:w-[450px] md:w-[500px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }}
            >
                <Card className="py-6">
                    <CardHeader>
                        <CardTitle className="text-center">Signup</CardTitle>
                    </CardHeader>
                    <CardContent>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    className="h-12"
                                    placeholder="Enter your name"
                                    name="name"
                                    onChange={handleChange}
                                    value={formData.name}
                                />
                                <Input
                                    className="h-12"
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    onChange={handleChange}
                                    value={formData.email}
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
                                <div className="relative">
                                    <Input
                                        className="h-12 pr-10"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Enter your password"
                                        onChange={handleChange}
                                        value={formData.password}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <Eye size={15} /> : <EyeOff size={15} />}
                                    </button>
                                </div>
                                <div className="relative">
                                    <Input
                                        className="h-12 pr-10"
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        placeholder="Enter password again"
                                        onChange={handleChange}
                                        value={formData.confirmPassword}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-3 flex items-center"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <Eye size={15} /> : <EyeOff size={15} />}
                                    </button>
                                </div>
                            </div>
                            {/* <div className="text-right">
                                <a href="#" className="text-sm text-[#0077B6] dark:text-[#00FFE5] hover:underline">
                                    Forgot password?
                                </a>
                            </div> */}
                            {error && (
                                <p className="text-sm text-red-500 text-center mt-2">{error}</p>
                            )}
                            <Button className="w-full h-12" type="submit" disabled={loading}>
                                {loading ? "Please wait..." : "Sign Up"}
                            </Button>
                            {loading && <p className="text-sm text-gray-500 text-center mt-2">Sending OTP, please wait...</p>}
                        </form>

                        <div className="flex items-center my-4">
                            <hr className="flex-grow border-gray-300 dark:border-gray-600" />
                            <span className="px-2 text-gray-500 dark:text-gray-400">OR</span>
                            <hr className="flex-grow border-gray-300 dark:border-gray-600" />
                        </div>
                        <Button variant="outline" className="w-full flex items-center justify-center h-12">
                            <FaGoogle className="w-5 h-5 mr-2" />
                            Continue with Google
                        </Button>
                        <p className="mt-4 text-center text-sm text-gray-700 dark:text-gray-300">
                            Already have an account?
                            <Link to='/login' className="text-[#0077B6] dark:text-[#00FFE5] font-medium hover:underline"> Login</Link>
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default SignUpForm;