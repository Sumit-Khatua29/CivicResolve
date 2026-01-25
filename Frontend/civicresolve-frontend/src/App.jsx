import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AnimatePresence } from "framer-motion";
import { lazy, Suspense } from "react";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import AdminPrivateRoute from "./components/AdminPrivateRoute";
import ContractorPrivateRoute from "./components/ContractorPrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import { Spinner } from "react-bootstrap";

// Lazy Load Pages
const Login = lazy(() => import("./pages/Auth/Login"));
const Register = lazy(() => import("./pages/Auth/Register"));
const AdminLogin = lazy(() => import("./pages/Auth/AdminLogin"));
const ContractorLogin = lazy(() => import("./pages/Auth/ContractorLogin"));
const Home = lazy(() => import("./pages/Home"));
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));
const IssueList = lazy(() => import("./pages/Admin/IssueList"));
const AnalyticsDashboard = lazy(
  () => import("./pages/Admin/AnalyticsDashboard"),
);
const UserManagement = lazy(() => import("./pages/Admin/UserManagement"));
const PendingContractors = lazy(
  () => import("./pages/Admin/PendingContractors"),
);
const ContractorDashboard = lazy(
  () => import("./pages/Contractor/ContractorDashboard"),
);
const CitizenDashboard = lazy(() => import("./pages/Citizen/CitizenDashboard"));
const ReportIssue = lazy(() => import("./pages/Citizen/ReportIssue"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Profile = lazy(() => import("./pages/Profile"));
const Feedback = lazy(() => import("./pages/Feedback"));

const LoadingFallback = () => (
  <div className="d-flex justify-content-center align-items-center vh-100">
    <Spinner animation="border" role="status" variant="primary">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </div>
);

function App() {
  const location = useLocation();

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <ScrollToTop />
        <div className="d-flex flex-column min-vh-100">
          <NavBar />
          <div className="flex-grow-1">
            <AnimatePresence mode="wait">
              <Suspense fallback={<LoadingFallback />}>
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin-login" element={<AdminLogin />} />
                  <Route
                    path="/contractor-login"
                    element={<ContractorLogin />}
                  />
                  <Route path="/register" element={<Register />} />
                  <Route path="/contact" element={<ContactUs />} />
                  <Route path="/about" element={<AboutUs />} />

                  {/* Admin Protected Routes */}
                  <Route element={<AdminPrivateRoute />}>
                    <Route
                      path="/admin"
                      element={
                        <ErrorBoundary>
                          <AdminDashboard />
                        </ErrorBoundary>
                      }
                    >
                      <Route index element={<Navigate to="issues" replace />} />
                      <Route path="issues" element={<IssueList />} />
                      <Route
                        path="approvals"
                        element={<PendingContractors />}
                      />
                      <Route
                        path="analytics"
                        element={<AnalyticsDashboard />}
                      />
                      <Route path="users" element={<UserManagement />} />
                      <Route
                        path="settings"
                        element={
                          <div className="glass-card p-4">
                            <h4>Settings</h4>
                            <p className="text-muted">
                              Application settings coming soon...
                            </p>
                          </div>
                        }
                      />
                    </Route>
                  </Route>

                  {/* Contractor Protected Routes */}
                  <Route element={<ContractorPrivateRoute />}>
                    <Route
                      path="/contractor"
                      element={
                        <ErrorBoundary>
                          <ContractorDashboard />
                        </ErrorBoundary>
                      }
                    />
                  </Route>

                  {/* Citizen Protected Routes */}
                  <Route element={<PrivateRoute />}>
                    <Route path="/citizen" element={<CitizenDashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/report-issue" element={<ReportIssue />} />
                    <Route path="/edit-issue/:id" element={<ReportIssue />} />
                    {/* Redirect old dashboard to home or handle specific redirection logic */}
                    <Route
                      path="/dashboard"
                      element={<Navigate to="/" replace />}
                    />
                  </Route>

                  <Route path="/feedback/:issueId" element={<Feedback />} />

                  {/* Catch all - redirect to home */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </AnimatePresence>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
