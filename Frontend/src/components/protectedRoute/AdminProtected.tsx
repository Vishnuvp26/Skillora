import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: "admin";
}

const AdminProtected: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
    const user = useSelector((state: RootState) => state.user);
    const token = user?.accessToken;

    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }

    if (requiredRole && user?.role !== requiredRole) {
        return <Navigate to={`/${user.role}/home`} replace />;
    }

    return <>{children}</>;
};

export default AdminProtected;