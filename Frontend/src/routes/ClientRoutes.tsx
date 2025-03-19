import { Routes, Route } from "react-router-dom";
import ClientHomepage from "@/pages/clients/ClientHomepage";
import ProtectedRoutes from "../components/protectedRoutes/ProtectedRoutes";
import NotFound from "@/components/error/NotFound";
import ClientProfile from "@/pages/clients/ClientProfile";

const ClientRoutes = () => (
    <Routes>
        <Route
            path="/home"
            element={
                <ProtectedRoutes requiredRole="client">
                    <ClientHomepage />
                </ProtectedRoutes>
            }
        />
        <Route path="profile"
            element={
                <ProtectedRoutes requiredRole="client">
                    <ClientProfile />
                </ProtectedRoutes>
            } />
        <Route path="*" element={<NotFound />} />
    </Routes>
);

export default ClientRoutes;