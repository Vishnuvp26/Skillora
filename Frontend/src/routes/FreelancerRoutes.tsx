import { Routes, Route } from "react-router-dom";
import FreelancerHomepage from "@/pages/freelancer/FreelancerHomepage";
import ProtectedRoutes from "../components/protectedRoute/ProtectedRoutes";

const FreelancerRoutes = () => (
    <Routes>
        <Route
            path="/home"
            element={
                <ProtectedRoutes requiredRole="freelancer">
                    <FreelancerHomepage/>
                </ProtectedRoutes>
            }
        />
    </Routes>
);

export default FreelancerRoutes;