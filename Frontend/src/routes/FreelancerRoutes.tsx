import { Routes, Route } from "react-router-dom";
import FreelancerHomepage from "@/pages/freelancer/FreelancerHomepage";
import ProtectedRoutes from "../components/protectedRoutes/ProtectedRoutes";
import NotFound from "@/components/error/NotFound";

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
        <Route path="*" element={<NotFound/>} />
    </Routes>
);

export default FreelancerRoutes;