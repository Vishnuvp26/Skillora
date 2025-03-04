import { Routes, Route } from "react-router-dom";
// import ProtectedRoutes from "./ProtectedRoutes";
import Dashboard from "@/pages/admin/Dashboard";
import Clients from "@/pages/admin/Clients";
import Freelancers from "@/pages/admin/Freelancers";
import Contracts from "@/pages/admin/Contracts";
import Payments from "@/pages/admin/Payments";
import JobCategories from "@/pages/admin/JobCategories";
import Skills from "@/pages/admin/Skills";

const AdminRoutes = () => (
    <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clients" element={<Clients/> } />
        <Route path="/freelancers" element={<Freelancers/> } />
        <Route path="/contracts" element={<Contracts/> } />
        <Route path="/payments" element={<Payments/> } />
        <Route path="/job-categories" element={<JobCategories/> } />
        <Route path="/skills" element={<Skills/> } />
    </Routes>
);

export default AdminRoutes;