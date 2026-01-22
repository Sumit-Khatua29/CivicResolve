import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaEye, FaHandshake, FaLightbulb, FaUsers, FaCheckCircle, FaCity, FaMapMarkerAlt, FaChartBar, FaCamera, FaSearch, FaTools, FaCheck } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import "./AboutUs.css";

const AboutUs = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <div className="about-page">
            {/* Hero Section */}
            <div className="py-5 mb-5 shadow-sm border-bottom about-hero-section">
                <Container>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center py-5"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            className="bg-white text-dark rounded-circle d-inline-flex align-items-center justify-content-center mb-4 shadow about-logo-circle"
                        >
                            <FaCity size={40} className="text-primary" />
                        </motion.div>
                        <h1 className="display-4 fw-bold mb-3 text-white">About Civic<span className="about-highlight-text">Resolve</span></h1>
                        <p className="lead text-light opacity-75 mx-auto about-lead-text">
                            Empowering citizens to drive positive change in their communities through transparent issue reporting and efficient resolution tracking.
                        </p>
                    </motion.div>
                </Container>
            </div>

            <Container className="mb-5">
                {/* Mission Section */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="mb-5 pb-5"
                >
                    <div className="text-center mb-5">
                        <motion.span variants={itemVariants} className="text-primary fw-bold text-uppercase small about-purpose-text">
                            Our Purpose
                        </motion.span>
                        <motion.h2 variants={itemVariants} className="display-6 fw-bold mt-2">
                            Our Mission
                        </motion.h2>
                        <motion.div variants={itemVariants} className="bg-primary mx-auto mt-3 about-divider"></motion.div>
                    </div>

                    <Row className="justify-content-center">
                        <Col lg={8} className="text-center">
                            <motion.p variants={itemVariants} className="fs-5 text-secondary lh-lg">
                                CivicResolve bridges the gap between citizens and local government by providing a streamlined platform for reporting and tracking community issues. We believe that every voice matters and that technology can be a catalyst for creating safer, cleaner, and more responsive neighborhoods. Our mission is to make civic engagement accessible, transparent, and effective for everyone.
                            </motion.p>
                        </Col>
                    </Row>
                </motion.div>

                {/* Core Values */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="mb-5 pb-5"
                >
                    <div className="text-center mb-5">
                        <h2 className="display-6 fw-bold">Our Core Values</h2>
                    </div>
                    
                    <Row className="g-4">
                        {[
                            { 
                                icon: FaCheckCircle, 
                                title: "Transparency", 
                                desc: "We believe in open communication and keeping citizens informed about the status of their reports every step of the way.",
                                color: "#16a34a",
                                bg: "#dcfce7"
                            },
                            { 
                                icon: FaLightbulb, 
                                title: "Efficiency", 
                                desc: "Our platform streamlines the reporting process, ensuring issues are quickly identified, categorized, and assigned to the right departments.",
                                color: "#eab308",
                                bg: "#fefce8" 
                            },
                            { 
                                icon: FaUsers, 
                                title: "Community First", 
                                desc: "Every feature we build is designed with the community's needs in mind, prioritizing user experience and accessibility.",
                                color: "#ef4444",
                                bg: "#fee2e2"
                            },
                        ].map((value, index) => (
                            <Col md={4} key={index}>
                                <motion.div variants={itemVariants} className="h-100">
                                    <Card className="h-100 border-0 shadow-sm hover-shadow-lg transition-all text-center p-4 rounded-4">
                                        <Card.Body>
                                            <div className="rounded-circle p-3 d-inline-flex mb-4 shadow-sm" style={{ backgroundColor: value.bg, color: value.color }}>
                                                <value.icon size={32} />
                                            </div>
                                            <Card.Title className="h4 fw-bold mb-3">{value.title}</Card.Title>
                                            <Card.Text className="text-muted">
                                                {value.desc}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>
                </motion.div>

                {/* Platform Features */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="mb-5 pb-5"
                >
                    <div className="text-center mb-5">
                        <h2 className="display-6 fw-bold">Platform Features</h2>
                    </div>
                    
                    <Row className="g-4">
                        {[
                            { 
                                icon: FaMapMarkerAlt, 
                                title: "Location-Based Reporting", 
                                desc: "Pinpoint exact locations using Google Maps integration for accurate issue identification and faster response times.",
                                color: "#3b82f6",
                                bg: "#eff6ff"
                            },
                            { 
                                icon: FaCheckCircle, 
                                title: "Real-Time Status Updates", 
                                desc: "Track your reported issues from submission to resolution with real-time status updates and admin comments.",
                                color: "#22c55e",
                                bg: "#f0fdf4"
                            },
                            { 
                                icon: FaChartBar, 
                                title: "Analytics Dashboard", 
                                desc: "Administrators can view comprehensive analytics and insights to identify trends and prioritize resources effectively.",
                                color: "#eab308",
                                bg: "#fefce8"
                            },
                            { 
                                icon: FaCamera, 
                                title: "Image Upload Support", 
                                desc: "Attach photos to your reports to provide visual evidence and help administrators better understand the issue.",
                                color: "#06b6d4",
                                bg: "#ecfeff"
                            },
                        ].map((feature, index) => (
                            <Col md={6} key={index}>
                                <motion.div variants={itemVariants} className="h-100">
                                    <Card className="h-100 border-0 shadow-sm hover-shadow-lg transition-all p-4 rounded-4">
                                        <Card.Body className="d-flex align-items-start">
                                            <div className="rounded-3 p-3 d-inline-flex me-4 shadow-sm" style={{ backgroundColor: feature.bg, color: feature.color }}>
                                                <feature.icon size={28} />
                                            </div>
                                            <div>
                                                <Card.Title className="h5 fw-bold mb-2">{feature.title}</Card.Title>
                                                <Card.Text className="text-muted small">
                                                    {feature.desc}
                                                </Card.Text>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>
                </motion.div>

                {/* How It Works Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="bg-primary text-white rounded-5 p-5 mb-5 shadow overflow-hidden position-relative"
                >
                    <div className="text-center mb-5 position-relative z-1">
                        <h2 className="display-6 fw-bold">How It Works</h2>
                    </div>

                    <Row className="text-center position-relative z-1 g-4">
                        {[
                            { step: 1, title: "Report", desc: "Citizens identify and report issues in their community with photos and location details.", icon: FaMapMarkerAlt },
                            { step: 2, title: "Review", desc: "Administrators review submissions and verify the validity of reported issues.", icon: FaSearch },
                            { step: 3, title: "Action", desc: "Issues are assigned to relevant departments and work begins to resolve them.", icon: FaTools },
                            { step: 4, title: "Resolve", desc: "Issues are resolved and citizens are notified of the completion and outcome.", icon: FaCheck },
                        ].map((item, index) => (
                            <Col md={3} key={index}>
                                <div className="d-flex flex-column align-items-center">
                                    <div className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center mb-3 shadow about-process-circle">
                                        {item.step}
                                    </div>
                                    <h4 className="fw-bold mb-2">{item.title}</h4>
                                    <p className="small text-white-50 px-2">{item.desc}</p>
                                </div>
                            </Col>
                        ))}
                    </Row>
                    
                    {/* Decorative Circle Overlay */}
                    <div className="position-absolute top-0 start-0 w-100 h-100 about-overlay-circle"></div>
                </motion.div>

                {/* Features / Statistics (Optional Polish) */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-5 p-5 shadow-sm text-center mb-5 border"
                >
                    <Row className="align-items-center">
                        <Col lg={6} className="text-lg-start mb-4 mb-lg-0">
                            <h3 className="fw-bold mb-3">Join Us in Building a Better Community</h3>
                            <p className="text-muted mb-4">
                                Whether you're a concerned citizen looking to report an issue or a government official wanting to improve community relations, CivicResolve is here to help.
                            </p>
                            <div className="d-flex gap-3 justify-content-center justify-content-lg-start">
                                <Link to="/register">
                                    <Button variant="primary" size="lg" className="rounded-pill px-4 fw-bold shadown-sm">
                                        Get Started Today
                                    </Button>
                                </Link>
                                <Link to="/contact">
                                    <Button variant="outline-primary" size="lg" className="rounded-pill px-4 fw-bold">
                                        Contact Us
                                    </Button>
                                </Link>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <Row className="g-3">
                                {[
                                    { number: "1,000+", label: "Active Citizens" },
                                    { number: "5,000+", label: "Issues Reported" },
                                    { number: "4,200+", label: "Issues Resolved" },
                                    { number: "95%", label: "Satisfaction Rate" },
                                ].map((stat, idx) => (
                                    <Col xs={6} key={idx}>
                                        <div className="p-3 bg-light rounded-4">
                                            <h3 className="fw-bold text-primary mb-1">{stat.number}</h3>
                                            <small className="text-muted fw-semibold">{stat.label}</small>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </Col>
                    </Row>
                </motion.div>

            </Container>
        </div>
    );
};

export default AboutUs;
