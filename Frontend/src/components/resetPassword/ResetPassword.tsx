import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { requestPasswordReset } from "@/api/auth/authApi";
import { validatePassword } from "@/utils/validation";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
    const userEmail = useSelector((state: RootState) => state.user.email);
    const userRole = useSelector((state: RootState) => state.user.role);

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
    const [backendErr, setErr] = useState("")
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (backendErr) setErr("");
    };

    const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validatePassword(formData.newPassword, formData.confirmPassword);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        try {
            setLoading(true);
            const response = await requestPasswordReset({
                email: userEmail,
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword,
            });

            toast.success(response.message || "Password has been changed");
            setTimeout(() => {
                if (userRole === "freelancer") {
                    navigate("/freelancer/home");
                } else if (userRole === "client") {
                    navigate("/client/home");
                } else {
                    navigate("/");
                }
            }, 1000);
        } catch (error: any) {
            setErr(error.error)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-950">
            <Card className="w-full max-w-lg p-8 rounded-xl dark:bg-gray-950 bg-gray-50 shadow-none border-none">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-semibold text-gray-800 dark:text-white">
                        Reset Password
                    </CardTitle>
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
            Create a strong password with at least 6 characters, including uppercase, lowercase, a number, and a special character.
        </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Current Password */}
                        <div className="relative flex flex-col mb-4">
                            <div className="relative">
                                <Input
                                    type={showPassword.current ? "text" : "password"}
                                    name="currentPassword"
                                    placeholder="Current Password"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    className="h-12 px-5 pr-12 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                                />
                                <span
                                    className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-gray-600 dark:text-gray-400"
                                    onClick={() => togglePasswordVisibility("current")}
                                >
                                    {showPassword.current ? <EyeOff size={20} /> : <Eye size={20} />}
                                </span>
                            </div>
                            {backendErr && <p className="text-red-500 text-sm mt-2">{backendErr}</p>}
                        </div>

                        {/* New Password */}
                        <div className="relative flex flex-col mb-4">
                            <div className="relative">
                                <Input
                                    type={showPassword.new ? "text" : "password"}
                                    name="newPassword"
                                    placeholder="New Password"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className="h-12 px-5 pr-12 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                                />
                                <span
                                    className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-gray-600 dark:text-gray-400"
                                    onClick={() => togglePasswordVisibility("new")}
                                >
                                    {showPassword.new ? <EyeOff size={20} /> : <Eye size={20} />}
                                </span>
                            </div>
                            {errors.password && <p className="text-red-500 text-sm mt-2">{errors.password}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div className="relative flex flex-col mb-4">
                            <div className="relative">
                                <Input
                                    type={showPassword.confirm ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="h-12 px-5 pr-12 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                                />
                                <span
                                    className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-gray-600 dark:text-gray-400"
                                    onClick={() => togglePasswordVisibility("confirm")}
                                >
                                    {showPassword.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                </span>
                            </div>
                            {errors.confirmPassword && <p className="text-red-500 text-sm mt-2">{errors.confirmPassword}</p>}
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full h-12 flex items-center justify-center gap-2 text-base font-medium rounded-lg bg-[#155f86] hover:bg-[#005f8c] text-white dark:bg-gradient-to-r dark:from-emerald-400 dark:to-cyan-400 dark:text-black transition-all duration-300"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin w-5 h-5" />
                                    Resetting...
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

export default ResetPassword;