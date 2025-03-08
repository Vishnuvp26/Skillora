import { Routes, Route } from "react-router-dom";
import ClientHomepage from "@/pages/clients/ClientHomepage";
import ProtectedRoutes from "../components/protectedRoute/ProtectedRoutes";
import NotFound from "@/components/error/NotFound";

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
        <Route path="*" element={<NotFound/>} />
    </Routes>
);

export default ClientRoutes;