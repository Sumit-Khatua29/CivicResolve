import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaLinkedin, FaHeart, FaInstagram, FaFacebook } from 'react-icons/fa';
import { motion } from 'framer-motion';
import "./Footer.css";

const Footer = () => {
    return (
        <motion.footer 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-white py-5 mt-auto position-relative footer-custom"
        >
            <Container>
                <Row className="gy-4">
                    <Col md={4}>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <h4 className="fw-bold mb-3">Civic<span className="footer-brand-span">Resolve</span></h4>
                            <p className="text-white-50 small">
                                Empowering citizens to build better communities. Report issues, track progress, and see change happen.
                            </p>
                        </motion.div>
                    </Col>
                    
                    <Col md={4}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            <h5 className="fw-bold mb-3 text-uppercase small footer-heading-small">Quick Links</h5>
                            <ul className="list-unstyled text-white-50 small">
                                <li className="mb-2"><Link to="/" className="text-decoration-none text-white-50 hover-white">Home</Link></li>
                                <li className="mb-2"><Link to="/about" className="text-decoration-none text-white-50 hover-white">About Us</Link></li>
                                <li className="mb-2"><Link to="/contact" className="text-decoration-none text-white-50 hover-white">Contact</Link></li>
                                <li className="mb-2"><Link to="/privacy" className="text-decoration-none text-white-50 hover-white">Privacy Policy</Link></li>
                            </ul>
                        </motion.div>
                    </Col>
                    
                    <Col md={4}>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            viewport={{ once: true }}
                        >
                            <h5 className="fw-bold mb-3 text-uppercase small footer-heading-small">Connect</h5>
                            <div className="d-flex gap-3 mb-3">
                                <motion.a whileHover={{ scale: 1.2, color: "#4ade80" }} href="#" className="text-white fs-5"><FaTwitter /></motion.a>
                                <motion.a whileHover={{ scale: 1.2, color: "#4ade80" }} href="#" className="text-white fs-5"><FaInstagram /></motion.a>
                                <motion.a whileHover={{ scale: 1.2, color: "#4ade80" }} href="#" className="text-white fs-5"><FaFacebook /></motion.a>
                            </div>
                            <p className="text-white-50  mt-4">
                                &copy; {new Date().getFullYear()} Civic Resolve. All rights reserved.
                            </p>
                            <p className="mt-4 border-top pt-3 text-white-50">Developed for efficient civic issue management</p>
                        </motion.div>
                    </Col>
                </Row>
                
                <hr className="my-4 border-secondary" />
                
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center text-white-50 small"
                >
                    Made with <FaHeart className="text-danger mx-1" /> for better cities.
                </motion.div>
            </Container>
        </motion.footer>
    );
};

export default Footer;
