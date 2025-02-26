import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Landing from "./pages/common/Landing";
import Login from "./pages/common/Login";
import SignUp from "./pages/common/SignUp";
import Otp from "./pages/common/Otp";
import ClientHomepage from "./pages/clients/ClientHomepage";
import SelectRole from "./pages/common/SelectRole";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";

const App = () => {
    return (
        <ThemeProvider>
            <Router>
                <Routes>
                    {/* Common Routes */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/otp" element={<Otp />} />
                    <Route path="/select-role" element={<SelectRole />} />

                    {/* Protected Signup Route */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/signup" element={<SignUp />} />
                    </Route>

                    {/* Client Routes */}
                    <Route path="/client-homepage" element={<ClientHomepage />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
};

export default App;