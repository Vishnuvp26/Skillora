import LoginForm from "@/components/login/LoginForm";
import LoginNav from "@/components/login/LoginNav";

const Login = () => {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
            <LoginNav/>
            <LoginForm/>
        </div>
    );
};

export default Login;