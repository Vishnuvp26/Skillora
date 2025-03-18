import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Landing from "@/pages/common/Landing";
import Login from "@/pages/common/Login";
import Otp from "@/pages/common/Otp";
import SelectRole from "@/pages/common/SelectRole";
import SignUp from "@/pages/common/SignUp";
import ProtectedRoute from "@/components/protectedRoutes/SelectProtected";
import { RootState } from "@/redux/store/store";

const AuthRoutes = () => {
    const user = useSelector((state: RootState) => state.user);
    const token = user?.accessToken;

    if (token) {
        return <Navigate to={`/${user.role}/home`} replace />;
    }

    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/otp" element={<Otp />} />
            <Route path="/select-role" element={<SelectRole />} />

            <Route element={<ProtectedRoute />}>
                <Route path="/signup" element={<SignUp />} />
            </Route>
        </Routes>
    );
};

export default AuthRoutes;