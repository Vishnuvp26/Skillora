import LoginForm from "@/components/loginComponents/LoginForm";
import LoginNav from "@/components/loginComponents/LoginNav";

const Login = () => {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
            <LoginNav/>
            <LoginForm/>
        </div>
    );
};

export default Login;