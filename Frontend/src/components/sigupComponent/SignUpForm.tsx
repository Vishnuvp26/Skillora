import { motion } from "framer-motion";
import { FaGoogle } from "react-icons/fa";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SignUpForm = () => {
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
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input className="h-12" placeholder="Enter your name"/>
                                <Input className="h-12" type="email" placeholder="Enter your email" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input className="h-12" type="password" placeholder="Enter your password" />
                                <Input className="h-12" type="password" placeholder="Enter password again"/>
                            </div>
                            <div className="text-right">
                                <a href="#" className="text-sm text-[#0077B6] dark:text-[#00FFE5] hover:underline">
                                    Forgot password?
                                </a>
                            </div>
                            <Button className="w-full h-12">Sign Up</Button>
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
                            <a href="#" className="text-[#0077B6] dark:text-[#00FFE5] font-medium hover:underline"> Login</a>
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}

export default SignUpForm;