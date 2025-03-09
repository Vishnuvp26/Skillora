import { Navigate, Outlet } from "react-router-dom";

const SelectProtected = () => {
    const userRole = localStorage.getItem("userRole");
    return userRole ? <Outlet /> : <Navigate to="/select-role" replace />;
};

export default SelectProtected;