import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Dashboard from "@/pages/admin/Dashboard";
import Clients from "@/pages/admin/Clients";
import Freelancers from "@/pages/admin/Freelancers";
import Contracts from "@/pages/admin/Contracts";
import Payments from "@/pages/admin/Payments";
import JobCategories from "@/pages/admin/JobCategories";
import Skills from "@/pages/admin/Skills";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminProtected from "@/components/protectedRoutes/AdminProtected";
import NotFound from "@/components/error/NotFound";
import { RootState } from "@/redux/store/store";

const AdminRoutes = () => {
    const user = useSelector((state: RootState) => state.user);
    const token = user?.accessToken;

    return (
        <Routes>
            <Route 
                path="/login" 
                element={token && user?.role === "admin" ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin />} 
            />
            <Route 
                path="/dashboard" 
                element={
                    <AdminProtected requiredRole="admin">
                        <Dashboard />
                    </AdminProtected>
                } 
            />
            <Route 
                path="/clients" 
                element={
                    <AdminProtected requiredRole="admin">
                        <Clients />
                    </AdminProtected>
                } 
            />
            <Route 
                path="/freelancers" 
                element={
                    <AdminProtected requiredRole="admin">
                        <Freelancers />
                    </AdminProtected>
                } 
            />
            <Route 
                path="/contracts" 
                element={
                    <AdminProtected requiredRole="admin">
                        <Contracts />
                    </AdminProtected>
                } 
            />
            <Route 
                path="/payments" 
                element={
                    <AdminProtected requiredRole="admin">
                        <Payments />
                    </AdminProtected>
                } 
            />
            <Route 
                path="/job-categories" 
                element={
                    <AdminProtected requiredRole="admin">
                        <JobCategories />
                    </AdminProtected>
                } 
            />
            <Route 
                path="/skills" 
                element={
                    <AdminProtected requiredRole="admin">
                        <Skills />
                    </AdminProtected>
                } 
            />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AdminRoutes;