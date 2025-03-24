import { Routes, Route } from "react-router-dom";
import FreelancerHomepage from "@/pages/freelancer/FreelancerHomepage";
import ProtectedRoutes from "../components/protectedRoutes/ProtectedRoutes";
import NotFound from "@/components/error/NotFound";
import FreelancerProfile from "@/pages/freelancer/FreelancerProfile";
import Jobs from "@/pages/freelancer/Jobs";
import FreelancerNav from "@/components/freelancer/FreelancerNav";
import Footer from "@/components/landing/Footer";
import JobDetail from "@/components/job/JobDetails";
import AppliedJobs from "@/pages/freelancer/AppliedJobs";

const FreelancerRoutes = () => (
    <div>
        <FreelancerNav/>
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
                        <JobDetail />
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
            <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer/>
    </div>
);

export default FreelancerRoutes;