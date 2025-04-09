import { Routes, Route, useLocation } from "react-router-dom";
import FreelancerHomepage from "@/pages/freelancer/FreelancerHomepage";
import ProtectedRoutes from "../components/protectedRoutes/ProtectedRoutes";
import NotFound from "@/components/error/NotFound";
import FreelancerProfile from "@/pages/freelancer/FreelancerProfile";
import Jobs from "@/pages/freelancer/Jobs";
import FreelancerNav from "@/components/freelancer/FreelancerNav";
import Footer from "@/components/landing/Footer";
import JobDetail from "@/components/job/JobDetails";
import AppliedJobs from "@/pages/freelancer/AppliedJobs";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Contracts from "@/pages/freelancer/Contracts";
import ContractDetails from "@/pages/freelancer/ContractDetails";
import ResetPassword from "@/components/resetPassword/ResetPassword";
import Chat from "@/pages/common/Chat";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const FreelancerRoutes = () => {
    const location = useLocation();

    const hideFooterPaths = ["/freelancer/messages"];
    const shouldHideFooter = hideFooterPaths.includes(location.pathname);

    return (
        <div>
            <FreelancerNav />
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
                        <ProtectedRoutes requiredRole="freelancer">
                            <FreelancerProfile />
                        </ProtectedRoutes>
                    }
                />
                <Route
                    path="jobs"
                    element={
                        <ProtectedRoutes requiredRole="freelancer">
                            <Jobs />
                        </ProtectedRoutes>
                    }
                />
                <Route
                    path="job/view-job/:id"
                    element={
                        <ProtectedRoutes requiredRole="freelancer">
                            <Elements stripe={stripePromise}>
                                <JobDetail />
                            </Elements>
                        </ProtectedRoutes>
                    }
                />
                <Route
                    path="jobs/applied-jobs"
                    element={
                        <ProtectedRoutes requiredRole="freelancer">
                            <AppliedJobs />
                        </ProtectedRoutes>
                    }
                />
                <Route
                    path="contracts"
                    element={
                        <ProtectedRoutes requiredRole="freelancer">
                            <Contracts />
                        </ProtectedRoutes>
                    }
                />
                <Route
                    path="contract/:id"
                    element={
                        <ProtectedRoutes requiredRole="freelancer">
                            <ContractDetails />
                        </ProtectedRoutes>
                    }
                />
                <Route
                    path="profile-settings"
                    element={
                        <ProtectedRoutes requiredRole="freelancer">
                            <ResetPassword />
                        </ProtectedRoutes>
                    }
                />
                <Route
                    path="messages"
                    element={
                        <ProtectedRoutes requiredRole="freelancer">
                            <Chat />
                        </ProtectedRoutes>
                    }
                />
                <Route path="*" element={<NotFound />} />
            </Routes>

            {!shouldHideFooter && <Footer />}
        </div>
    );
};

export default FreelancerRoutes;