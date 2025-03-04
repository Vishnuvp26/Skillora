import { Routes, Route } from "react-router-dom";
import ClientHomepage from "@/pages/clients/ClientHomepage";
import ProtectedRoutes from "./ProtectedRoutes";

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
    </Routes>
);

export default ClientRoutes;