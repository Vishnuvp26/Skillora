import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import SignUpNav from "@/components/sigupComponent/SignupNav";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const SelectRole = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState("");

    useEffect(() => {
        localStorage.removeItem("userRole");
    }, []);

    const handleContinue = () => {
        if (role) {
            localStorage.setItem("userRole", role);
            navigate("/signup");
        }
    };

    return (
        <motion.div 
            className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-950 px-4"
        >
            <SignUpNav />
            <h2 className="text-2xl font-bold mb-6 text-center">Join as a client or freelancer</h2>
            <RadioGroup className="flex flex-col sm:flex-row gap-6">
                <motion.div 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                >
                    <Card
                        className={`p-6 w-72 border-2 cursor-pointer transition-all ${
                            role === "client" 
                                ? "border-[#0077B6] dark:border-[#00FFE5] shadow-lg" 
                                : "border-gray-300 dark:border-gray-600"
                        }`}
                        onClick={() => setRole("client")}
                    >
                        <div className="flex items-center gap-3">
                            <RadioGroupItem value="client" checked={role === "client"} />
                            <p className="text-lg">I’m a client, hiring for a project</p>
                        </div>
                    </Card>
                </motion.div>

                <motion.div 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                >
                    <Card
                        className={`p-6 w-72 border-2 cursor-pointer transition-all ${
                            role === "freelancer" 
                                ? "border-[#0077B6] dark:border-[#00FFE5] shadow-lg" 
                                : "border-gray-300 dark:border-gray-600"
                        }`}
                        onClick={() => setRole("freelancer")}
                    >
                        <div className="flex items-center gap-3">
                            <RadioGroupItem value="freelancer" checked={role === "freelancer"} />
                            <p className="text-lg">I’m a freelancer, looking for work</p>
                        </div>
                    </Card>
                </motion.div>
            </RadioGroup>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                    onClick={handleContinue}
                    disabled={!role}
                    className="bg-[#0077B6] hover:bg-[#005f8c] text-white px-6 py-2 mt-6 rounded-lg dark:bg-transparent dark:border dark:border-[#00FFE5] dark:text-[#00FFE5] dark:hover:bg-[#00FFE511]"
                >
                    Continue
                </Button>
            </motion.div>

            <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">
                Already have an account?{" "}
                <Link to="/login" className="text-[#0077B6] dark:text-[#00FFE5] font-medium hover:underline">
                    Login
                </Link>
            </p>
        </motion.div>
    );
};

export default SelectRole;