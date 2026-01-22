import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AnimatePresence } from "framer-motion";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import AdminLogin from "./pages/Auth/AdminLogin";
import Home from "./pages/Home";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import IssueList from "./pages/Admin/IssueList";
import AnalyticsDashboard from "./pages/Admin/AnalyticsDashboard";
import UserManagement from "./pages/Admin/UserManagement";
import CitizenDashboard from "./pages/Citizen/CitizenDashboard";
import ReportIssue from "./pages/Citizen/ReportIssue";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import Profile from "./pages/Profile";
import Feedback from "./pages/Feedback";
import PrivateRoute from "./components/PrivateRoute";
import AdminPrivateRoute from "./components/AdminPrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";

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
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/register" element={<Register />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/about" element={<AboutUs />} />

              {/* Admin Protected Routes */}
              <Route element={<AdminPrivateRoute />}>
                <Route path="/admin" element={
                  <ErrorBoundary>
                    <AdminDashboard />
                  </ErrorBoundary>
                }>
                  <Route index element={<Navigate to="issues" replace />} />
                  <Route path="issues" element={<IssueList />} />
                  <Route path="analytics" element={<AnalyticsDashboard />} />
                  <Route path="users" element={<UserManagement />} />
                  <Route path="settings" element={<div className="glass-card p-4"><h4>Settings</h4><p className="text-muted">Application settings coming soon...</p></div>} />
                </Route>
              </Route>

              {/* Citizen Protected Routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/citizen" element={<CitizenDashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/report-issue" element={<ReportIssue />} />
                <Route path="/edit-issue/:id" element={<ReportIssue />} />
                {/* Redirect old dashboard to home or handle specific redirection logic */}
                <Route path="/dashboard" element={<Navigate to="/" replace />} />
              </Route>

              <Route path="/feedback/:issueId" element={<Feedback />} />

              {/* Catch all - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </div>
        <Footer />
      </div>
    </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
