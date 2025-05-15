import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "react-hot-toast";
import Spinner from "./components/ui/Spinner";
import Scroll from "./components/scroll/Scroll";
import { socket } from "./utils/socket";
const AuthRoutes = lazy(() => import("@/routes/AuthRoutes"));
const FreelancerRoutes = lazy(() => import("@/routes/FreelancerRoutes"));
const ClientRoutes = lazy(() => import("@/routes/ClientRoutes"));
const AdminRoutes = lazy(() => import("@/routes/AdminRoutes"));

const App = () => {

    useEffect(() => {
        console.log("socket");
        
        socket.on("connect", () => {
            console.log(`socket connected to server with id: ${socket.id} `);
    
        })
        socket.on("connect_error", (err) => {
            console.error("Socket connection error:", err.message);
        });
        return () => {
            if (socket.connected) {
                socket.disconnect();
                console.log("Socket disconnected");
            }
        }
    
    }, []);

    return (
        <ThemeProvider>
            <Toaster position="top-right" reverseOrder={false} />
            <Router>
                <Scroll />
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