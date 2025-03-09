import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "react-hot-toast";
import Spinner from "./components/ui/Spinner";
const AuthRoutes = lazy(() => import("@/routes/AuthRoutes"));
const FreelancerRoutes = lazy(() => import("@/routes/FreelancerRoutes"));
const ClientRoutes = lazy(() => import("@/routes/ClientRoutes"));
const AdminRoutes = lazy(() => import("@/routes/AdminRoutes"));

const App = () => {
    return (
        <ThemeProvider>
            <Toaster position="top-right" reverseOrder={false} />
            <Router>
                <Suspense fallback={<Spinner />}>
                    <Routes>
                        <Route path="/*" element={<AuthRoutes />} />
                        <Route path="/freelancer/*" element={<FreelancerRoutes />} />
                        <Route path="/client/*" element={<ClientRoutes />} />
                        <Route path="/admin/*" element={<AdminRoutes />} />
                    </Routes>
                </Suspense>
            </Router>
        </ThemeProvider>
    );
};

export default App;