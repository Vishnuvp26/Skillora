import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "react-hot-toast";
import AuthRoutes from "./routes/AuthRoutes";
import FreelancerRoutes from "./routes/FreelancerRoutes";
import ClientRoutes from "./routes/ClientRoutes";
import Spinner from "./components/ui/Spinner";
import { Suspense } from "react";
import AdminRoutes from "./routes/AdminRoutes";

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