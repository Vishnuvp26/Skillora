import SignUpForm from "@/components/sigupComponent/SignUpForm";
import SignUpNav from "@/components/sigupComponent/SignupNav";

const SignUp = () => {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
            <SignUpNav />
            <SignUpForm />
        </div>
    )
};

export default SignUp