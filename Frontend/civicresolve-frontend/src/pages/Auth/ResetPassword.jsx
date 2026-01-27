import React, { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Form, Button, Container, Alert, Card, InputGroup } from "react-bootstrap";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import "./Login.css"; // Reusing Login styles

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    if (newPassword.length < 6) {
        setError("Password must be at least 6 characters long.");
        setLoading(false);
        return;
    }

    if (newPassword !== confirmPassword) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setTimeout(() => {
            navigate('/login');
        }, 3000);
      } else {
        setError(data.message || "Failed to reset password.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="auth-container"
    >
      <div className="auth-overlay"></div>

      <Container style={{ position: "relative", zIndex: 2, maxWidth: "450px" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-0 rounded-4 overflow-hidden shadow-lg auth-card">
            <div className="auth-gradient-line"></div>
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold mb-2 text-dark">Reset Password</h2>
                <p className="text-muted mb-0">
                  Enter your new password
                </p>
              </div>

              {message && (
                <Alert variant="success" className="border-0 shadow-sm rounded-3">
                  {message}
                </Alert>
              )}

              {error && (
                <Alert
                  variant="danger"
                  className="border-0 bg-danger text-white fill-danger shadow-sm rounded-3"
                >
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formNewPassword">
                  <Form.Label className="fw-semibold small text-uppercase text-muted auth-label">
                    New Password
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light border-end-0 text-primary ps-3">
                      <FaLock />
                    </InputGroup.Text>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="py-2 border-start-0 bg-light text-dark auth-input-control"
                    />
                     <Button
                        variant="link"
                        className="bg-light text-muted border border-start-0"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ textDecoration: 'none' }}
                      >
                       {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-4" controlId="formConfirmPassword">
                  <Form.Label className="fw-semibold small text-uppercase text-muted auth-label">
                    Confirm Password
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light border-end-0 text-primary ps-3">
                      <FaLock />
                    </InputGroup.Text>
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="py-2 border-start-0 bg-light text-dark auth-input-control"
                    />
                    <Button
                        variant="link"
                        className="bg-light text-muted border border-start-0"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{ textDecoration: 'none' }}
                      >
                       {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </InputGroup>
                </Form.Group>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                    className="w-100 rounded-pill fw-bold text-white shadow py-2 border-0 auth-login-btn"
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </Button>
                </motion.div>
              </Form>

              <div className="text-center mt-4">
                <Link to="/login" className="text-decoration-none text-muted small">
                  Back to Login
                </Link>
              </div>
            </Card.Body>
          </Card>
        </motion.div>
      </Container>
    </motion.div>
  );
};

export default ResetPassword;
