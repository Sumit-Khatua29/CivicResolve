import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Container, Alert, Card, InputGroup, Row, Col } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUserShield, FaSync } from "react-icons/fa";
import { motion } from "framer-motion";
import bgImage from "../../assets/civic_background.png";
import "./Register.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("citizen");
  const [captchaId, setCaptchaId] = useState("");
  const [captchaQuestion, setCaptchaQuestion] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [error, setError] = useState("");
  const { register, getCaptcha } = useContext(AuthContext);
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchCaptcha();
  }, []);

  const fetchCaptcha = async () => {
    try {
        const response = await getCaptcha();
        setCaptchaId(response.data.id);
        setCaptchaQuestion(response.data.question);
        setCaptchaAnswer(""); 
    } catch (err) {
        console.error("Failed to load captcha", err);
        setError("Failed to load captcha service");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
    }

    try {
      await register(username, email, password, role === "admin" ? "ROLE_ADMIN" : "ROLE_CITIZEN", captchaId, captchaAnswer);
      alert("Registered successfully!");
      navigate("/login");
    } catch (err) {
      console.error("Registration error full object:", err);
      if (err.response) {
          console.error("Registration error data:", err.response.data);
          console.error("Registration error status:", err.response.status);
      }
      const errorMsg = err.response?.data?.message || 
                       err.response?.data?.error || 
                       err.message || 
                       "Registration failed";
      setError(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="auth-container"
    >
        {/* Dark Overlay for better text readability */}
        <div className="auth-overlay"></div>
        
        <Container style={{ position: "relative", zIndex: 2, maxWidth: "550px" }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
            <Card className="border-0 rounded-4 overflow-hidden shadow-lg auth-card">
                <div className="register-gradient-line"></div>
                <Card.Body className="p-5">
                    <div className="text-center mb-4">
                        <h2 className="fw-bold mb-2 text-dark">Create Account</h2>
                        <p className="text-muted mb-0">Join Civic Resolve and make a difference.</p>
                    </div>
                    
                    {error && <Alert variant="danger" className="border-0 bg-danger text-white fill-danger shadow-sm rounded-3">{error}</Alert>}
                    
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicUsername">
                            <Form.Label className="fw-semibold small text-uppercase text-muted auth-label">Username</Form.Label>
                            <InputGroup>
                                <InputGroup.Text className="bg-light border-end-0 text-primary ps-3">
                                    <FaUser />
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Choose username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="py-2 border-start-0 bg-light auth-input-control"
                                />
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label className="fw-semibold small text-uppercase text-muted auth-label">Email Address</Form.Label>
                            <InputGroup>
                                <InputGroup.Text className="bg-light border-end-0 text-primary ps-3">
                                    <FaEnvelope />
                                </InputGroup.Text>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="py-2 border-start-0 bg-light auth-input-control"
                                />
                            </InputGroup>
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label className="fw-semibold small text-uppercase text-muted auth-label">Password</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text className="bg-light border-end-0 text-primary ps-3">
                                            <FaLock />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="py-2 border-start-0 bg-light auth-input-control"
                                        />
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                                    <Form.Label className="fw-semibold small text-uppercase text-muted auth-label">Confirm</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text className="bg-light border-end-0 text-primary ps-3">
                                            <FaLock />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Confirm"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            className="py-2 border-start-0 bg-light auth-input-control"
                                        />
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                        </Row>
                        
                        <div className="mb-3 text-end">
                             <Button 
                                variant="link" 
                                onClick={togglePasswordVisibility}
                                className="text-muted p-0 text-decoration-none small hover-text-primary auth-password-toggle"
                            >
                                {showPassword ? <><FaEyeSlash className="me-1" /> Hide Passwords</> : <><FaEye className="me-1" /> Show Passwords</>}
                            </Button>
                        </div>

                        <Form.Group className="mb-4" controlId="formBasicRole">
                            <Form.Label className="fw-semibold small text-uppercase text-muted auth-label">I want to join as</Form.Label>
                            <InputGroup>
                                <InputGroup.Text className="bg-light border-end-0 text-primary ps-3">
                                    <FaUserShield />
                                </InputGroup.Text>
                                <Form.Select 
                                    value={role} 
                                    onChange={(e) => setRole(e.target.value)} 
                                    className="form-select py-2 border-start-0 bg-light auth-input-control"
                                >
                                    <option value="citizen">Citizen (Report Issues)</option>
                                    <option value="admin">Admin (Manage Issues)</option>
                                </Form.Select>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="fw-semibold small text-uppercase text-muted auth-label">Security Check</Form.Label>
                            <div className="d-flex align-items-center mb-2">
                                <div className="bg-white px-3 py-2 rounded border flex-grow-1 text-center fw-bold letter-spacing-1">
                                    {captchaQuestion || "Loading..."}
                                </div>
                                <Button variant="light" className="ms-2 border" onClick={fetchCaptcha}>
                                    <FaSync className="text-muted" />
                                </Button>
                            </div>
                            <Form.Control
                                type="text"
                                placeholder="Enter the result"
                                value={captchaAnswer}
                                onChange={(e) => setCaptchaAnswer(e.target.value)}
                                required
                                className="py-2 bg-light auth-input-control"
                            />
                        </Form.Group>

                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button 
                                variant="primary" 
                                type="submit" 
                                className="w-100 btn rounded-pill fw-bold text-white shadow py-3 border-0 register-submit-btn"
                            >
                                Register
                            </Button>
                        </motion.div>
                    </Form>
                    <div className="text-center mt-4">
                        <small className="text-secondary">Already have an account? <Link to="/login" className="text-primary fw-bold text-decoration-none ms-1">Login here</Link></small>
                    </div>
                </Card.Body>
            </Card>
            </motion.div>
        </Container>
    </motion.div>
  );
};

export default Register;
