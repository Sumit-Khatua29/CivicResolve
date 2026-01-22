import React, { useContext } from "react";
import { Container, Button, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { FaCamera, FaClipboardCheck, FaUsers } from "react-icons/fa";
import AdminHome from "./Admin/AdminHome";
import CitizenHome from "./Citizen/CitizenHome";
import "./Home.css";

const Home = () => {
    const { currentUser } = useContext(AuthContext);

    // If user is admin, show the new Admin Home dashboard
    if (currentUser && currentUser.role === "ROLE_ADMIN") {
        return <AdminHome />;
    }
    
    // If user is citizen, show the new Citizen Home dashboard
    if (currentUser && currentUser.role === "ROLE_CITIZEN") {
        return <CitizenHome />;
    }

    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

  return (
    <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="home-overflow-hidden"
    >
        {/* Hero Section */}
        <div 
            className="text-white home-hero-section" 
        >
            <Container className="home-container-relative">
                <Row className="align-items-center">
                    <Col lg={7}>
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                        >
                            <motion.h1 
                                variants={fadeInUp} 
                                className="display-3 fw-bold mb-4 home-hero-title"
                            >
                                Be the <span className="home-text-highlight">Problem Solver</span> Your City Needs.
                            </motion.h1>
                            <motion.p 
                                variants={fadeInUp} 
                                className="lead mb-5 home-hero-lead" 
                            >
                                Empower your community by reporting issues instantly. Track progress, precise location tagging, and watch your city transform—one resolution at a time.
                            </motion.p>
                            <motion.div variants={fadeInUp}>
                                {!currentUser ? (
                                    <>
                                        <motion.div
                                            className="d-inline-block me-3"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            animate={{ 
                                                boxShadow: ["0px 0px 0px rgba(16, 185, 129, 0)", "0px 0px 20px rgba(16, 185, 129, 0.5)", "0px 0px 0px rgba(16, 185, 129, 0)"] 
                                            }}
                                            transition={{ 
                                                boxShadow: {
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }
                                            }}
                                        >
                                            <Link 
                                                to="/register"
                                                className="btn btn-success btn-lg px-5 py-3 rounded-pill fw-bold btn-get-started"
                                            >
                                                Get Started
                                            </Link>
                                        </motion.div>
                                        <motion.div 
                                            className="d-inline-block"
                                            whileHover={{ scale: 1.05 }} 
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Link 
                                                to="/login"
                                                className="btn btn-lg px-5 py-3 rounded-pill fw-bold position-relative overflow-hidden btn-home-login-wrapper"
                                            >
                                                <span className="btn-home-login-text">Login</span>
                                                <motion.div 
                                                    animate={{ x: ["-100%", "200%"] }}
                                                    transition={{ repeat: Infinity, duration: 2, repeatDelay: 1, ease: "easeInOut" }}
                                                    className="btn-home-login-shine" 
                                                />
                                            </Link>
                                        </motion.div>
                                    </>
                                ) : (
                                    <Link 
                                        to="/citizen"
                                        className="btn btn-light btn-lg px-5 py-3 rounded-pill fw-bold text-success shadow btn-dashboard-link"
                                    >
                                        Go to Dashboard
                                    </Link>
                                )}
                            </motion.div>
                        </motion.div>
                    </Col>
                    
                    {/* Abstract Visual / Illustration Placeholder */}
                    <Col lg={5} className="d-none d-lg-block">
                         <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                         >
                            <div className="home-visual-circle">
                                {/* You could put an SVG or Image here */}
                                <div className="home-visual-icon">
                                    <FaClipboardCheck />
                                </div>
                            </div>
                         </motion.div>
                    </Col>
                </Row>
            </Container>
            
            {/* Wave Separator */}
            <div className="home-wave-separator">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path fill="#ffffff" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
            </div>
        </div>

        {/* Features Section */}
        <Container className="py-5">
            <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="text-center mb-5"
            >
                <div className="home-how-it-works-label">
                    How it works
                </div>
                <h2 className="display-6 fw-bold">From Problem to Solution</h2>
            </motion.div>

            <Row>
                <Col md={4} className="mb-4">
                    <motion.div 
                        whileHover={{ y: -10 }}
                        className="h-100 p-4 rounded-4 shadow-sm border-0 bg-white text-center"
                    >
                        <div className="d-inline-flex align-items-center justify-content-center bg-light rounded-circle mb-4 home-feature-icon-wrapper">
                            <FaCamera size={32} />
                        </div>
                        <h4>1. Snap & Report</h4>
                        <p className="text-muted">See a pothole or garbage pile? Take a photo, add a description, and our system automatically tags your location.</p>
                    </motion.div>
                </Col>
                <Col md={4} className="mb-4">
                    <motion.div 
                        whileHover={{ y: -10 }}
                        className="h-100 p-4 rounded-4 shadow-sm border-0 bg-white text-center"
                    >
                        <div className="d-inline-flex align-items-center justify-content-center bg-light rounded-circle mb-4 home-feature-icon-wrapper blue">
                            <FaClipboardCheck size={32} />
                        </div>
                        <h4>2. Admin Review</h4>
                        <p className="text-muted">City officials receive your report instantly on their dashboard. They verify, prioritize, and assign it.</p>
                    </motion.div>
                </Col>
                <Col md={4} className="mb-4">
                    <motion.div 
                        whileHover={{ y: -10 }}
                        className="h-100 p-4 rounded-4 shadow-sm border-0 bg-white text-center"
                    >
                        <div className="d-inline-flex align-items-center justify-content-center bg-light rounded-circle mb-4 home-feature-icon-wrapper purple">
                            <FaUsers size={32} />
                        </div>
                        <h4>3. Resolution</h4>
                        <p className="text-muted">Track the status in real-time. Once fixed, the status is updated to 'Resolved'. A cleaner city for everyone.</p>
                    </motion.div>
                </Col>
            </Row>
        </Container>
    </motion.div>
  );
};

export default Home;
