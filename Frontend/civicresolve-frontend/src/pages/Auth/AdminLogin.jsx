import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Form,
  Button,
  Container,
  Alert,
  Card,
  InputGroup,
} from "react-bootstrap";
import { useGoogleLogin } from "@react-oauth/google";
import { AuthContext } from "../../context/AuthContext";
import { FaUserShield, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { motion } from "framer-motion";
import bgImage from "../../assets/civic_background.png"; // Assuming same background for consistency, or we can use another
import "./AdminLogin.css";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login, googleLogin, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const googleLoginHelper = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const user = await googleLogin(tokenResponse.access_token);
        if (user.role === "ROLE_ADMIN") {
          navigate("/admin");
        } else {
          logout();
          setError("Access Denied: You are not an admin.");
        }
      } catch (err) {
        setError("Google Login failed.");
      }
    },
    onError: () => setError("Google Login failed."),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = await login(username, password);
      console.log("Logged in user role:", user.role); // Debugging
      if (user.role === "ROLE_ADMIN") {
        navigate("/admin");
      } else {
        logout(); // Logout if not admin preventing session leak
        setError("Access Denied: You are not an admin.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Invalid username or password");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="admin-auth-container"
    >
      {/* Dark Overlay with slightly different tint for Admin */}
      <div className="admin-auth-overlay"></div>

      <Container style={{ position: "relative", zIndex: 2, maxWidth: "400px" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass-card border-0 rounded-4 overflow-hidden text-dark shadow-lg">
            <div
              style={{
                height: "6px",
                background: "linear-gradient(90deg, #3b82f6, #10b981)",
              }}
            ></div>
            <Card.Body className="p-4 p-md-5">
              <div className="text-center mb-4">
                <div className="mb-3 text-warning">
                  <FaUserShield size={40} />
                </div>
                <h2 className="fw-bold mb-1">Admin Portal</h2>
                <p className="text-muted mb-0">Secure Login</p>
              </div>

              {error && (
                <Alert
                  variant="danger"
                  className="border-0 bg-danger text-white fill-danger"
                >
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                  <Form.Label className="fw-semibold small text-uppercase admin-auth-label">
                    Username
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-white text-primary border-end-0">
                      <FaUserShield />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Admin Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="py-2 border-start-0 admin-auth-input-control"
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-4" controlId="formBasicPassword">
                  <Form.Label className="fw-semibold small text-uppercase admin-auth-label">
                    Password
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-white text-primary border-end-0">
                      <FaLock />
                    </InputGroup.Text>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="py-2 border-start-0 border-end-0 admin-auth-input-control"
                    />
                    <InputGroup.Text
                      className="bg-white text-muted border-start-0 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ cursor: "pointer" }}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>

                <Button
                  variant="warning"
                  type="submit"
                  className="w-100 btn-primary-custom rounded-pill fw-bold text-white shadow"
                >
                  Login to Dashboard
                </Button>

                <div className="d-flex align-items-center my-3">
                  <div className="flex-grow-1 border-bottom border-secondary"></div>
                  <span className="mx-3 text-muted small fw-semibold text-uppercase">
                    Or
                  </span>
                  <div className="flex-grow-1 border-bottom border-secondary"></div>
                </div>

                <Button
                  variant="light"
                  className="w-100 rounded-pill fw-bold text-dark shadow-sm py-2 border"
                  onClick={() => googleLoginHelper()}
                >
                  <FcGoogle className="me-2" size={20} />
                  Sign in with Google
                </Button>
              </Form>

              <div className="text-center mt-4 border-top pt-3">
                <p className="mb-0 text-muted small">
                  Not an admin?{" "}
                  <Link
                    to="/login"
                    className="text-primary fw-bold text-decoration-none"
                  >
                    Citizen Login
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </motion.div>
      </Container>
    </motion.div>
  );
};

export default AdminLogin;
