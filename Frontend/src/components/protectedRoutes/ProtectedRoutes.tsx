import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: "freelancer" | "client" | "admin";
}

const ProtectedRoutes: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
    const user = useSelector((state: RootState) => state.user);
    const token = user?.accessToken;

    if (!token) {
        return <Navigate to="/" replace />;
    }

    if (user.status === "blocked") {
        return <Navigate to="/" replace />;
    }

    if (requiredRole && user?.role !== requiredRole) {
        return <Navigate to={`/${user.role}/home`} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoutes;