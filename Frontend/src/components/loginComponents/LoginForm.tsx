import { motion } from "framer-motion";
import { FaGoogle } from "react-icons/fa";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const LoginForm = () => {
    return (
        <div className="flex items-center justify-center min-h-[90vh] mt-[80px] sm:mt-[40px] md:mt-16 lg:mt-14">
            <motion.div
                className="w-[90%] sm:w-[400px] min-h-[500px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }}
            >
                <Card className="min-h-[550px]">
                    <CardHeader>
                        <CardTitle className="text-center">Login</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-6">
                            <Input type="email" placeholder="Enter your email" className="h-12" />
                            <Input type="password" placeholder="Enter your password" className="h-12" />
                            <div className="text-right">
                                <a href="#" className="text-sm text-[#0077B6] dark:text-[#00FFE5] hover:underline">
                                    Forgot password?
                                </a>
                            </div>
                            <Button className="w-full h-12">Login</Button>
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
                            <a href="#" className="text-[#0077B6] dark:text-[#00FFE5] font-medium hover:underline"> Sign up</a>
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default LoginForm;