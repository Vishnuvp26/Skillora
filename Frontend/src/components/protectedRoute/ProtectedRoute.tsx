import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const userRole = localStorage.getItem("userRole");
    return userRole ? <Outlet /> : <Navigate to="/select-role" replace />;
};

export default ProtectedRoute;