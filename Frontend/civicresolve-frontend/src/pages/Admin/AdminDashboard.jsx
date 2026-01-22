import React, { useState, useContext } from "react";
import { Container, Row, Col, Offcanvas, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaCheckCircle, FaExclamationCircle, FaClock, FaTimesCircle, FaBars } from "react-icons/fa";
import AdminSidebar from "./AdminSidebar";
import StatCard from "./StatCard";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./AdminDashboard.css";

const AdminDashboard = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [showSidebar, setShowSidebar] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/admin-login");
    };

    const handleCloseSidebar = () => setShowSidebar(false);
    const handleShowSidebar = () => setShowSidebar(true);

    // Calculate stats (Mock or fetched globally if needed, for now locally scoped to display only on issues page ideally, 
    // but user might want global stats. We will keep stats state here and pass setter to Outlet context if possible)
    const [stats, setStats] = useState({
        total: 0,
        resolved: 0,
        verified: 0,
        pending: 0,
        rejected: 0
    });

    // Check if we are on the main issues list to show stats, or show stats everywhere? 
    // Let's show stats only on the issues list (default view) for cleanliness as per previous design
    const showStats = location.pathname === '/admin' || location.pathname === '/admin/issues';

    return (
        <div className="d-flex admin-dashboard-layout">
            {/* Mobile Sidebar Toggle */}
            <Button 
                variant="primary" 
                className="d-lg-none position-fixed start-0 top-50 translate-middle-y rounded-end shadow-lg p-3 z-3 admin-mobile-toggle"
                onClick={handleShowSidebar}
            >
                <FaBars />
            </Button>

            {/* Desktop Sidebar (visible on lg screens and up) */}
            <div className="d-none d-lg-block admin-sidebar-wrapper">
                <AdminSidebar onLogout={handleLogout} />
            </div>

            {/* Mobile Sidebar (Offcanvas) */}
            <Offcanvas show={showSidebar} onHide={handleCloseSidebar} responsive="lg" className="d-lg-none bg-transparent border-0">
                <Offcanvas.Header closeButton className="bg-white rounded-end admin-offcanvas-header">
                    <Offcanvas.Title className="fw-bold text-primary">Menu</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="p-0">
                    <AdminSidebar onLogout={handleLogout} onClose={handleCloseSidebar} />
                </Offcanvas.Body>
            </Offcanvas>

            {/* Main Content */}
            <div className="flex-grow-1 p-4 admin-main-content">
                <Container fluid>
                    {/* Header Stats */}
                    {showStats && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4"
                        >
                            <Row className="g-3">
                                <Col xs={12} sm={6} md={4} lg={3}>
                                    <StatCard title="Total Issues" count={stats.total} icon={<FaExclamationCircle size={24} />} color="#4361ee" />
                                </Col>
                                <Col xs={6} sm={6} md={2}>
                                    <StatCard title="Resolved" count={stats.resolved} icon={<FaCheckCircle size={24} />} color="#2ec4b6" />
                                </Col>
                                <Col xs={6} sm={6} md={2}>
                                    <StatCard title="Verified" count={stats.verified} icon={<FaCheckCircle size={24} />} color="#0dcaf0" />
                                </Col>
                                <Col xs={6} sm={6} md={2}>
                                    <StatCard title="Pending" count={stats.pending} icon={<FaClock size={24} />} color="#ff9f1c" />
                                </Col>
                                <Col xs={6} sm={6} md={3}>
                                    <StatCard title="Rejected" count={stats.rejected} icon={<FaTimesCircle size={24} />} color="#e71d36" />
                                </Col>
                            </Row>
                        </motion.div>
                    )}

                    <Outlet context={{ setStats }} />
                    
                </Container>
            </div>
        </div>
    );
};

export default AdminDashboard;
