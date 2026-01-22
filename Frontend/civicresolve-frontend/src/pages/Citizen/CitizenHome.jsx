import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Badge, ListGroup } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
    FaFileAlt, 
    FaClock, 
    FaExclamationCircle, 
    FaCheckCircle, 
    FaMapMarkedAlt, 
    FaPlusCircle, 
    FaLightbulb,
    FaInfoCircle
} from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import IssueService from '../../services/issue.service';
import { Link } from 'react-router-dom';
import "./CitizenHome.css";

const CitizenHome = () => {
    const { currentUser } = useContext(AuthContext);
    const [stats, setStats] = useState({
        total: 0,
        underReview: 0,
        verified: 0,
        inProgress: 0,
        resolved: 0
    });
    const [recentIssues, setRecentIssues] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await IssueService.getMyIssues(); // Assuming this endpoint exists and returns user's issues
            const issues = Array.isArray(response.data) ? response.data : [];
            
            setStats({
                total: issues.length,
                underReview: issues.filter(i => i.status === 'PENDING').length,
                verified: issues.filter(i => i.status === 'VERIFIED').length,
                inProgress: issues.filter(i => i.status === 'IN_PROGRESS').length,
                resolved: issues.filter(i => i.status === 'RESOLVED').length
            });

            // Get top 5 recent issues
            setRecentIssues(issues.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5));

        } catch (error) {
            console.error("Error fetching data for citizen home", error);
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
        <div className="flex-grow-1 citizen-home-wrapper">
            <Container className="pb-4">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Welcome Section */}
                    <div className="mb-4">
                        <motion.h1 variants={itemVariants} className="display-6 fw-bold text-dark mb-2">
                            Welcome, {currentUser?.username || 'Citizen'}! 👋
                        </motion.h1>
                        <motion.p variants={itemVariants} className="text-muted lead fs-6">
                            Your voice matters. Report issues and help improve your community.
                        </motion.p>
                    </div>

                    {/* Stats Cards */}
                    <Row className="mb-4 g-3 row-cols-1 row-cols-md-3 row-cols-lg-5">
                        <Col>
                            <HomeStatCard 
                                icon={<FaFileAlt size={20} />} 
                                count={stats.total} 
                                label="My Reports" 
                                color="#3b82f6" 
                                bg="rgba(59, 130, 246, 0.1)"
                            />
                        </Col>
                        <Col>
                            <HomeStatCard 
                                icon={<FaClock size={20} />} 
                                count={stats.underReview} 
                                label="Under Review" 
                                color="#f59e0b" 
                                bg="rgba(245, 158, 11, 0.1)"
                            />
                        </Col>
                        <Col>
                             <HomeStatCard 
                                icon={<FaCheckCircle size={20} />} 
                                count={stats.verified} 
                                label="Verified" 
                                color="#0dcaf0" 
                                bg="rgba(13, 202, 240, 0.1)" 
                            />
                        </Col>
                        <Col>
                            <HomeStatCard 
                                icon={<FaExclamationCircle size={20} />} 
                                count={stats.inProgress} 
                                label="Being Worked On" 
                                color="#3b82f6" 
                                bg="rgba(59, 130, 246, 0.1)" 
                            />
                        </Col>
                       
                        <Col>
                            <HomeStatCard 
                                icon={<FaCheckCircle size={20} />} 
                                count={stats.resolved} 
                                label="Resolved" 
                                color="#10b981" 
                                bg="rgba(16, 185, 129, 0.1)"
                            />
                        </Col>
                    </Row>

                    {/* Quick Actions */}
                    <h5 className="fw-bold mb-3 text-dark">Quick Actions</h5>
                    <Row className="mb-4 g-3">
                        <Col md={4}>
                            <ActionCard 
                                title="Report New Issue" 
                                subtitle="Tell us about a problem"
                                icon={<FaPlusCircle size={28} />}
                                to="/report-issue"
                                variant="outline-success"
                                type="success"
                            />
                        </Col>
                        <Col md={4}>
                            <ActionCard 
                                title="My Reports" 
                                subtitle="View all your issues"
                                icon={<FaFileAlt size={28} />}
                                to="/citizen" 
                                variant="outline-primary"
                                type="primary"
                            />
                        </Col>
                        <Col md={4}>
                             <ActionCard 
                                title="Map View" 
                                subtitle="See issues on map"
                                icon={<FaMapMarkedAlt size={28} />}
                                to="/citizen"
                                variant="outline-info"
                                type="info"
                            />
                        </Col>
                    </Row>

                    <Row className="g-4">
                        {/* Recent Reports */}
                        <Col lg={8}>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fw-bold mb-0 text-dark">My Recent Reports</h5>
                                <Link to="/citizen" className="btn btn-outline-primary btn-sm rounded-pill px-3">View All</Link>
                            </div>
                            <Card className="border-0 shadow-sm rounded-4 recent-reports-card">
                                <Card.Body className="p-4 d-flex flex-column justify-content-center align-items-center">
                                    {recentIssues.length > 0 ? (
                                        <div className="w-100">
                                             {recentIssues.map(issue => (
                                                <div key={issue.id} className="d-flex align-items-center justify-content-between py-3 border-bottom">
                                                    <div>
                                                        <div className="fw-bold text-dark">{issue.description.substring(0, 60)}{issue.description.length > 60 ? '...' : ''}</div>
                                                        <small className="text-muted">{new Date(issue.createdAt).toLocaleDateString()}</small>
                                                    </div>
                                                    <Badge bg="light" text="dark" className="border">{issue.status}</Badge>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <>
                                            <div className="text-muted mb-3 display-4 empty-state-icon"><FaFileAlt /></div>
                                            <p className="text-muted mb-3">No issues reported yet</p>
                                            <p className="small text-muted mb-3">Start by reporting an issue in your community</p>
                                            <Link to="/report-issue">
                                                 <Button variant="success" className="rounded-pill px-4">
                                                     <FaPlusCircle className="me-2" /> Report First Issue
                                                 </Button>
                                            </Link>
                                        </>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Sidebar: Status Updates & Tips */}
                        <Col lg={4}>
                            <div className="mb-4">
                                <h5 className="fw-bold mb-3 text-dark">Status Updates</h5>
                                <Card className="border-0 shadow-sm rounded-4 status-updates-card">
                                    <Card.Body className="p-3">
                                        {recentIssues.filter(i => i.status !== 'PENDING').length > 0 ? (
                                            <ListGroup variant="flush">
                                                {recentIssues
                                                    .filter(i => i.status !== 'PENDING')
                                                    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
                                                    .slice(0, 5)
                                                    .map(issue => (
                                                        <ListGroup.Item key={issue.id} className="border-0 px-0 py-2">
                                                            <div className="d-flex align-items-center mb-1">
                                                                <Badge 
                                                                    bg={
                                                                        issue.status === 'RESOLVED' ? 'success' :
                                                                        issue.status === 'IN_PROGRESS' ? 'primary' :
                                                                        issue.status === 'REJECTED' ? 'danger' :
                                                                        issue.status === 'VERIFIED' ? 'info' : 'secondary'
                                                                    } 
                                                                    className="me-2"
                                                                >
                                                                    {issue.status}
                                                                </Badge>
                                                                <small className="text-muted ms-auto status-date">
                                                                    {new Date(issue.updatedAt || issue.createdAt).toLocaleDateString()}
                                                                </small>
                                                            </div>
                                                            <p className="mb-0 small text-dark">
                                                                id: #{issue.id} - {issue.description.substring(0, 40)}{issue.description.length > 40 ? '...' : ''}
                                                            </p>
                                                            {issue.remark && (
                                                                <small className="text-muted d-block mt-1 fst-italic">
                                                                    Admin: "{issue.remark}"
                                                                </small>
                                                            )}
                                                        </ListGroup.Item>
                                                    ))
                                                }
                                            </ListGroup>
                                        ) : (
                                            <div className="text-center py-4">
                                                <div className="text-muted mb-3 display-4 empty-update-icon"><FaInfoCircle /></div>
                                                <p className="text-muted small">No status updates yet.<br/>We'll notify you when an admin reviews your reports.</p>
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </div>

                            <div>
                                <h5 className="fw-bold mb-0 text-dark d-flex align-items-center p-2 bg-primary text-white rounded-top quick-tips-header">
                                    <FaLightbulb className="me-2" /> Quick Tips
                                </h5>
                                <Card className="border-0 shadow-sm rounded-bottom rounded-0">
                                    <ListGroup variant="flush">
                                        <ListGroup.Item className="small border-0 py-2">Add photos to help identify the issue</ListGroup.Item>
                                        <ListGroup.Item className="small border-0 py-2">Use the map to pinpoint exact location</ListGroup.Item>
                                        <ListGroup.Item className="small border-0 py-2">Provide detailed descriptions</ListGroup.Item>
                                        <ListGroup.Item className="small border-0 py-2">Check back for admin updates</ListGroup.Item>
                                    </ListGroup>
                                </Card>
                            </div>
                        </Col>
                    </Row>
                    
                    <div className="mt-5 text-center text-muted small">
                        <p>Thank you for helping improve our community! • Last updated: {new Date().toLocaleString()}</p>
                        
                    </div>

                </motion.div>
            </Container>
        </div>
    );
};

// Sub-components
const HomeStatCard = ({ icon, count, label, color, bg }) => (
    <Card className="glass-card border-0 h-100 text-center py-3">
        <Card.Body className="p-2">
            <div 
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2 shadow-sm citizen-stat-icon-wrapper"
                style={{ backgroundColor: bg, color: color }}
            >
                {icon}
            </div>
            <h4 className="fw-bold mb-0">{count}</h4>
            <small className="text-muted">{label}</small>
        </Card.Body>
    </Card>
);

const ActionCard = ({ title, subtitle, icon, to, variant, type }) => {
    return (
        <Link to={to} className="text-decoration-none">
            <motion.div whileHover={{ y: -3 }}>
                <Card 
                    className={`glass-card border-0 h-100 action-card action-card-${type}`} 
                >
                    <Card.Body className="d-flex align-items-center p-3">
                         <div className="me-3 action-icon">
                             {icon}
                         </div>
                         <div>
                             <h6 className="fw-bold mb-0 action-title">{title}</h6>
                             <small className="text-muted" style={{ fontSize: '0.75rem' }}>{subtitle}</small>
                         </div>
                    </Card.Body>
                </Card>
            </motion.div>
        </Link>
    );
};

export default CitizenHome;
