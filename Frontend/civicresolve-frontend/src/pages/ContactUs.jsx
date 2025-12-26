import React from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaPaperPlane } from 'react-icons/fa';
import "./ContactUs.css";

const ContactUs = () => {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="contact-page">
             {/* Hero Section */}
            <div className="text-white py-5 mb-5 shadow-sm contact-hero-section">
                <Container>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.6 }}
                        variants={fadeIn}
                        className="text-center py-4"
                    >
                        <h1 className="display-4 fw-bold mb-3">Contact Us</h1>
                        <p className="lead text-light opacity-75 mx-auto contact-lead-text">
                            Have questions or need assistance? We're here to help! Reach out to us and we'll get back to you as soon as possible.
                        </p>
                    </motion.div>
                </Container>
            </div>
            
            <Container>

                <Row className="gy-5">
                    {/* Get in Touch Section */}
                    <Col lg={5}>
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <h2 className="h3 fw-bold mb-4">Get in Touch</h2>
                            
                            <div className="d-flex align-items-start mb-4">
                                <div className="p-3 rounded-circle shadow-sm me-3 contact-icon-wrapper-blue">
                                    <FaEnvelope size={24} />
                                </div>
                                <div>
                                    <h5 className="fw-bold mb-1">Email</h5>
                                    <p className="text-muted mb-0">support@civicresolve.com</p>
                                    <p className="text-muted">info@civicresolve.com</p>
                                </div>
                            </div>

                            <div className="d-flex align-items-start mb-4">
                                <div className="p-3 rounded-circle shadow-sm me-3 contact-icon-wrapper-green">
                                    <FaPhone size={24} />
                                </div>
                                <div>
                                    <h5 className="fw-bold mb-1">Phone</h5>
                                    <p className="text-muted mb-0"> +91 8260655912</p>
                                    <p className="text-muted">Mon - Fri, 9am - 6pm</p>
                                </div>
                            </div>

                            <div className="d-flex align-items-start mb-4">
                                <div className="p-3 rounded-circle shadow-sm me-3 contact-icon-wrapper-red">
                                    <FaMapMarkerAlt size={24} />
                                </div>
                                <div>
                                    <h5 className="fw-bold mb-1">Office</h5>
                                    <p className="text-muted mb-0">CDAC-Hyderabad</p>
                                    <p className="text-muted">Hardware Park, Sy No. 1/1, Telangana - 501510</p>
                                </div>
                            </div>

                            <div className="d-flex align-items-start">
                                <div className="p-3 rounded-circle shadow-sm me-3 contact-icon-wrapper-purple">
                                    <FaClock size={24} />
                                </div>
                                <div>
                                    <h5 className="fw-bold mb-1">Business Hours</h5>
                                    <p className="text-muted mb-0">Monday - Friday: 9:00 AM - 5:00 PM</p>
                                    <p className="text-muted">Saturday - Sunday: Closed</p>
                                </div>
                            </div>
                        </motion.div>
                    </Col>

                    {/* Contact Form Section */}
                    <Col lg={7}>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
                                <Card.Body className="p-4 p-md-5">
                                    <h3 className="fw-bold mb-4">Send us a Message</h3>
                                    <Form>
                                        <Row>
                                            <Col md={6} className="mb-3">
                                                <Form.Group controlId="formGridName">
                                                    <Form.Label className="fw-semibold">Full Name *</Form.Label>
                                                    <Form.Control type="text" placeholder="John Doe" className="py-2" />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6} className="mb-3">
                                                <Form.Group controlId="formGridEmail">
                                                    <Form.Label className="fw-semibold">Email Address *</Form.Label>
                                                    <Form.Control type="email" placeholder="johndoe@example.com" className="py-2" />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Form.Group className="mb-3" controlId="formGridSubject">
                                            <Form.Label className="fw-semibold">Subject *</Form.Label>
                                            <Form.Select className="py-2">
                                                <option>Select a subject</option>
                                                <option>General Inquiry</option>
                                                <option>Technical Support</option>
                                                <option>Feedback & Suggestions</option>
                                                <option>Report an Issue</option>
                                            </Form.Select>
                                        </Form.Group>

                                        <Form.Group className="mb-4" controlId="formGridMessage">
                                            <Form.Label className="fw-semibold">Message *</Form.Label>
                                            <Form.Control as="textarea" rows={5} placeholder="Tell us how we can help you..." />
                                            <Form.Text className="text-muted">
                                                Minimum 10 characters required
                                            </Form.Text>
                                        </Form.Group>

                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <Button variant="primary" type="submit" className="w-100 py-3 fw-bold rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2">
                                                <FaPaperPlane /> Send Message
                                            </Button>
                                        </motion.div>
                                    </Form>
                                    
                                    <div className="mt-4 p-3 bg-light rounded-3 border-start border-4 border-info">
                                        <small className="text-muted">
                                            <strong>Note:</strong> For urgent issues requiring immediate attention, please call our support line directly. Response time for email inquiries is typically within 24-48 hours during business days.
                                        </small>
                                    </div>
                                </Card.Body>
                            </Card>
                        </motion.div>
                    </Col>
                </Row>

                {/* Map Section */}
                <Row className="mt-5 pt-4">
                    <Col>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="rounded-4 overflow-hidden shadow-sm bg-white p-2"
                        >
                            <Row className="g-0">
                                <Col md={5} className="bg-light d-flex align-items-center justify-content-center">
                                    <div className="text-center p-4">
                                        <FaMapMarkerAlt size={48} className="text-secondary mb-3 opacity-50" />
                                        <h4 className="fw-bold text-secondary">Office Location</h4>
                                        <p className="text-muted mb-0">CDAC-Hyderabad</p>
                                        <p className="text-muted">
                                            Plot No. 6 & 7 Hardware Park,<br /> 
                                            Sy No. 1/1, Srisailam Highway,<br /> 
                                            Kehavagiri, Hyderabad,<br /> 
                                            Telangana 501510
                                        </p>
                                    </div>
                                </Col>
                                <Col md={7}>
                                    <div className="contact-map-container">
                                        <iframe 
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5247.647654880818!2d78.47431727336755!3d17.240599920226654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcba57e67a2bc25%3A0xc0d5031672bc95cd!2sCentre%20for%20Development%20of%20Advanced%20Computing!5e0!3m2!1sen!2sin!4v1766464768982!5m2!1sen!2sin" 
                                            width="100%" 
                                            height="100%" 
                                            className="iframe-map"
                                            allowFullScreen="" 
                                            loading="lazy" 
                                            referrerPolicy="no-referrer-when-downgrade"
                                            title="CDAC Hyderabad Location"
                                        ></iframe>
                                    </div>
                                </Col>
                            </Row>
                        </motion.div>
                    </Col>
                </Row>
                
                <Row className="mt-4">
                     <Col>
                        <motion.div 
                             initial={{ opacity: 0 }}
                             whileInView={{ opacity: 1 }}
                             viewport={{ once: true }}
                             className="alert alert-warning border-0 shadow-sm d-flex align-items-center" 
                             role="alert"
                        >
                             <FaClock className="me-2 fs-4" />
                             <div>
                                <strong>Emergency Notice:</strong> This contact form is not monitored 24/7. For emergencies requiring immediate attention (such as safety hazards, infrastructure failures, or life-threatening situations), please call 911 or your local emergency services immediately.
                             </div>
                        </motion.div>
                     </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ContactUs;
