import { Routes, Route } from "react-router-dom";
import ClientHomepage from "@/pages/clients/ClientHomepage";
import ProtectedRoutes from "../components/protectedRoutes/ProtectedRoutes";
import NotFound from "@/components/error/NotFound";
import ClientProfile from "@/pages/clients/ClientProfile";
import PostJob from "@/pages/clients/PostJob";
import ClientNav from "@/components/client/ClientNav";
import Footer from "@/components/landing/Footer";
import JobDetail from "@/components/job/JobDetails";
import EditJob from "@/pages/clients/EditJob";

const ClientRoutes = () => (
    <div>
        <ClientNav />
        <Routes>
            <Route
                path="home"
                element={
                    <ProtectedRoutes requiredRole="client">
                        <ClientHomepage />
                    </ProtectedRoutes>
                }
            />
            <Route
                path="profile"
                element={
                    <ProtectedRoutes requiredRole="client">
                        <ClientProfile />
                    </ProtectedRoutes>
                }
            />
            <Route
                path="post-job"
                element={
                    <ProtectedRoutes requiredRole="client">
                        <PostJob />
                    </ProtectedRoutes>
                }
            />
            <Route
                path="job/view-job/:id"
                element={
                    <ProtectedRoutes requiredRole="client">
                        <JobDetail />
                    </ProtectedRoutes>
                }
            />
            <Route
                path="job/edit-job/:id"
                element={
                    <ProtectedRoutes requiredRole="client">
                        <EditJob />
                    </ProtectedRoutes>
                }
            />
            <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
    </div>
);

export default ClientRoutes;