import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Container, Alert, Card, InputGroup } from "react-bootstrap";
import { FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";
import "./Login.css"; // Reusing Login styles

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setError(data.message || "Failed to send reset email.");
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
                <h2 className="fw-bold mb-2 text-dark">Forgot Password</h2>
                <p className="text-muted mb-0">
                  Enter your email to reset your password
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
                <Form.Group className="mb-4" controlId="formBasicEmail">
                  <Form.Label className="fw-semibold small text-uppercase text-muted auth-label">
                    Email Address
                  </Form.Label>
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
                      className="py-2 border-start-0 bg-light text-dark auth-input-control"
                    />
                  </InputGroup>
                </Form.Group>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                    className="w-100 rounded-pill fw-bold text-white shadow py-2 border-0 auth-login-btn"
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword;
