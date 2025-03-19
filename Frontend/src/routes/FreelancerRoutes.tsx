import { Routes, Route } from "react-router-dom";
import FreelancerHomepage from "@/pages/freelancer/FreelancerHomepage";
import ProtectedRoutes from "../components/protectedRoutes/ProtectedRoutes";
import NotFound from "@/components/error/NotFound";
import FreelancerProfile from "@/pages/freelancer/FreelancerProfile";

const FreelancerRoutes = () => (
    <Routes>
        <Route
            path="home"
            element={
                <ProtectedRoutes requiredRole="freelancer">
                    <FreelancerHomepage />
                </ProtectedRoutes>
            }
        />
        <Route
            path="profile"
            element={
                <ProtectedRoutes>
                    <FreelancerProfile />
                </ProtectedRoutes>
            }
        />
        <Route path="*" element={<NotFound />} />
    </Routes>
);

export default FreelancerRoutes;