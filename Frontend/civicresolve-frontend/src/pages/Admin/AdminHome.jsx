import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
    FaFileAlt, 
    FaClock, 
    FaExclamationCircle, 
    FaCheckCircle, 
    FaMapMarkerAlt, 
    FaChartBar, 
    FaThLarge,
    FaExclamationTriangle
} from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import IssueService from '../../services/issue.service';
import { Link } from 'react-router-dom';
import "./AdminHome.css";

const AdminHome = () => {
    const { currentUser, logout } = useContext(AuthContext);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        inProgress: 0,
        resolved: 0
    });
    const [recentIssues, setRecentIssues] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await IssueService.getAllIssues();
            const issues = Array.isArray(response.data) ? response.data : [];
            
            setStats({
                total: issues.length,
                pending: issues.filter(i => i.status === 'PENDING').length,
                inProgress: issues.filter(i => i.status === 'IN_PROGRESS').length,
                resolved: issues.filter(i => i.status === 'RESOLVED').length
            });

            // Get top 5 recent issues
            setRecentIssues(issues.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5));

        } catch (error) {
            console.error("Error fetching data for admin home", error);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="admin-home-container">
            {/* Header / Navbar shim if needed, assuming NavBar component is above this */}
            
            <Container className="py-5">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Welcome Section */}
                    <div className="mb-5">
                        <motion.h1 variants={itemVariants} className="display-5 fw-bold text-dark mb-2">
                            Welcome back, {currentUser?.username || 'Admin User'}! 👋
                        </motion.h1>
                        <motion.p variants={itemVariants} className="text-muted lead fs-5">
                            Here's what's happening with citizen issue reports today.
                        </motion.p>
                    </div>

                    {/* Stats Cards */}
                    <Row className="mb-5 g-4">
                        <Col md={3}>
                            <HomeStatCard 
                                icon={<FaFileAlt size={24} />} 
                                count={stats.total} 
                                label="Total Issues" 
                                color="#3b82f6" 
                                bg="rgba(59, 130, 246, 0.1)"
                            />
                        </Col>
                        <Col md={3}>
                            <HomeStatCard 
                                icon={<FaClock size={24} />} 
                                count={stats.pending} 
                                label="Pending Review" 
                                color="#f59e0b" 
                                bg="rgba(245, 158, 11, 0.1)"
                            />
                        </Col>
                        <Col md={3}>
                            <HomeStatCard 
                                icon={<FaExclamationCircle size={24} />} 
                                count={stats.inProgress} 
                                label="In Progress" 
                                color="#3b82f6" 
                                bg="rgba(59, 130, 246, 0.1)" 
                            />
                        </Col>
                        <Col md={3}>
                            <HomeStatCard 
                                icon={<FaCheckCircle size={24} />} 
                                count={stats.resolved} 
                                label="Resolved" 
                                color="#10b981" 
                                bg="rgba(16, 185, 129, 0.1)"
                            />
                        </Col>
                    </Row>

                    {/* Quick Actions */}
                    <h5 className="fw-bold mb-3 text-dark">Quick Actions</h5>
                    <Row className="mb-5 g-4">
                        <Col md={4}>
                            <ActionCard 
                                title="View Full Dashboard" 
                                subtitle="Analytics & Reports"
                                icon={<FaThLarge size={32} />}
                                to="/admin/issues"
                                variant="primary"
                            />
                        </Col>
                        <Col md={4}>
                            <ActionCard 
                                title="Map View" 
                                subtitle="See All Issues on Map"
                                icon={<FaMapMarkerAlt size={32} />}
                                to="/admin/analytics" // Map is part of Analytics Dashboard
                                variant="success"
                            />
                        </Col>
                        <Col md={4}>
                            <ActionCard 
                                title="Analytics" 
                                subtitle="Charts & Statistics"
                                icon={<FaChartBar size={32} />}
                                to="/admin/analytics"
                                variant="info"
                            />
                        </Col>
                    </Row>

                    {/* Bottom Section: Recent Issues & Priority Alerts */}
                    <Row className="g-4">
                        <Col lg={8}>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fw-bold mb-0 text-dark">Recent Issues</h5>
                                <Link to="/admin/issues" className="btn btn-outline-primary btn-sm rounded-pill px-3">View All</Link>
                            </div>
                            <Card className="border-0 shadow-sm rounded-4 admin-home-recent-card">
                                <Card.Body className="p-4 d-flex flex-column justify-content-center align-items-center">
                                    {recentIssues.length > 0 ? (
                                        <div className="w-100">
                                            {/* Simple list view for now, usually table */}
                                            {recentIssues.map(issue => (
                                                <div key={issue.id} className="d-flex align-items-center justify-content-between py-3 border-bottom">
                                                    <div>
                                                        <div className="fw-bold text-dark">{issue.description.substring(0, 50)}...</div>
                                                    </div>
                                                    <Badge bg="light" text="dark" className="border">{issue.status}</Badge>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <>
                                            <div className="text-muted mb-3 display-4"><FaFileAlt /></div>
                                            <p className="text-muted">No issues reported yet</p>
                                        </>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={4}>
                            <h5 className="fw-bold mb-3 text-dark">Priority Alerts</h5>
                             <Card className="border-0 shadow-sm rounded-4 admin-home-recent-card">
                                <Card.Body className="p-4 d-flex flex-column justify-content-center align-items-center text-center">
                                    <div className="text-muted mb-3 display-4 admin-home-empty-icon"><FaExclamationTriangle /></div>
                                    <p className="text-muted">No issues to display</p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                </motion.div>
            </Container>
        </div>
    );
};

// Sub-components for AdminHome
const HomeStatCard = ({ icon, count, label, color, bg }) => (
    <Card className="border-0 shadow-sm h-100 rounded-4 text-center py-3">
        <Card.Body>
            <div 
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3 home-stat-icon-wrapper"
                style={{ backgroundColor: bg, color: color }}
            >
                {icon}
            </div>
            <h2 className="fw-bold mb-1 display-6">{count}</h2>
            <p className="text-muted mb-0">{label}</p>
        </Card.Body>
    </Card>
);

const ActionCard = ({ title, subtitle, icon, to, variant }) => {
    let bgClass = "bg-primary-subtle text-primary";
    if (variant === 'success') bgClass = "bg-success-subtle text-success";
    if (variant === 'info') bgClass = "bg-info-subtle text-info";

    return (
        <Link to={to} className="text-decoration-none">
            <motion.div whileHover={{ y: -5 }}>
                <Card className={`border-0 shadow-sm h-100 rounded-4 ${bgClass} action-card`}>
                    <Card.Body className="d-flex flex-column justify-content-center align-items-center p-4">
                         <div className="mb-3">{icon}</div>
                         <h5 className="fw-bold mb-1">{title}</h5>
                         <small className="opacity-75">{subtitle}</small>
                    </Card.Body>
                </Card>
            </motion.div>
        </Link>
    );
};

export default AdminHome;
