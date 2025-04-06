import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {FormData} from '../../types/Types'
import { registerUser } from "@/api/auth/authApi";
import { validateRegistration } from "@/utils/validation";
import loginImage from '../../assets/test3.png';

const SignUpForm = () => {
    
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: ""
    })

    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Record<string, string>>({});
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
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        
        const { errors } = validateRegistration({ ...formData, [name]: value });
        setError((prev) => ({ ...prev, [name]: errors[name] || "" }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        const { valid, errors } = validateRegistration(formData);
    
        if (!valid) {
            setError(errors);
            return;
        }
    
        try {
            setLoading(true);
            await registerUser({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role
            });
            toast.success('OTP sent to your mail');
            navigate("/otp", { state: { email: formData.email, userData: formData } });
        } catch (error: any) {
            setError({ general: error.error || "Something went wrong, please try again" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row items-center justify-center min-h-screen dark:bg-gray-950 bg-white gap-4 md:gap-0">
            <div className="hidden md:flex w-full md:w-1/2 h-full flex-col items-center justify-center">
                <img src={loginImage} alt="Signup illustration" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="w-full md:w-1/2 flex items-center justify-center p-6">
                <motion.div
                    className="w-full max-w-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }}
                >
                    <Card className="py-6 shadow-none border-none">
                        <CardHeader>
                            <CardTitle className="text-center text-2xl font-medium">Sign Up</CardTitle>
                        </CardHeader>
                        <CardContent>

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Name Field */}
                                    <div className="flex flex-col">
                                        <Input
                                            className="h-12"
                                            placeholder="Enter your name"
                                            name="name"
                                            onChange={handleChange}
                                            value={formData.name}
                                        />
                                        {error.name && <p className="text-sm text-red-500 mt-1">{error.name}</p>}
                                    </div>

                                    {/* Email Field */}
                                    <div className="flex flex-col">
                                        <Input
                                            className="h-12"
                                            type="email"
                                            name="email"
                                            placeholder="Enter your email"
                                            onChange={handleChange}
                                            value={formData.email}
                                        />
                                        {error.email && <p className="text-sm text-red-500 mt-1">{error.email}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Password Field */}
                                    <div className="flex flex-col">
                                        <div className="relative flex items-center">
                                            <Input
                                                className="h-12 pr-10 flex-grow"
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                placeholder="Enter your password"
                                                onChange={handleChange}
                                                value={formData.password}
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 flex items-center"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <Eye size={15} /> : <EyeOff size={15} />}
                                            </button>
                                        </div>
                                        {error.password && <p className="text-sm text-red-500 mt-1">{error.password}</p>}
                                    </div>

                                    {/* Confirm Password Field */}
                                    <div className="flex flex-col">
                                        <div className="relative flex items-center">
                                            <Input
                                                className="h-12 pr-10 flex-grow"
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                placeholder="Enter password again"
                                                onChange={handleChange}
                                                value={formData.confirmPassword}
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 flex items-center"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? <Eye size={15} /> : <EyeOff size={15} />}
                                            </button>
                                        </div>
                                        {error.confirmPassword && <p className="text-sm text-red-500 mt-1">{error.confirmPassword}</p>}
                                    </div>
                                </div>
                                {error.general && <p className="text-sm text-red-500 text-center mt-2">{error.general}</p>}
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
                                        "Sign Up"
                                    )}
                                </Button>
                                {loading && <p className="text-sm text-gray-500 text-center mt-2">Sending OTP, please wait...</p>}
                            </form>

                            <div className="flex items-center my-4 mt-6">
                                <hr className="flex-grow border-gray-300 dark:border-gray-600" />
                                <span className="px-2 text-gray-500 dark:text-gray-400">OR</span>
                                <hr className="flex-grow border-gray-300 dark:border-gray-600" />
                            </div>
                            <p className="mt-4 text-center text-sm text-gray-700 dark:text-gray-300">
                                Already have an account?
                                <Link to='/login' className="text-[#0077B6] dark:text-[#00FFE5] font-medium hover:underline"> Login</Link>
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default SignUpForm;