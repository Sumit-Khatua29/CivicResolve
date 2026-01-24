import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import {
  Form,
  Button,
  Container,
  Alert,
  Card,
  InputGroup,
} from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import bgImage from "../../assets/civic_background.png";
import "./Login.css";

const Login = () => {
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
          logout();
          setError("Invalid credentials, you are not a citizen");
          return;
        } else if (user.role === "ROLE_CONTRACTOR") {
          navigate("/contractor");
          return;
        }
        navigate("/");
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
      if (user.role === "ROLE_ADMIN") {
        logout();
        setError("Invalid credentials, you are not a citizen");
        return;
      } else if (user.role === "ROLE_CONTRACTOR") {
        navigate("/contractor");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("Invalid username or password");
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
      {/* Dark Overlay */}
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
                <h2 className="fw-bold mb-2 text-dark">Welcome Back</h2>
                <p className="text-muted mb-0">
                  Login to report & track issues
                </p>
              </div>

              {error && (
                <Alert
                  variant="danger"
                  className="border-0 bg-danger text-white fill-danger shadow-sm rounded-3"
                >
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                  <Form.Label className="fw-semibold small text-uppercase text-muted auth-label">
                    Username
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light border-end-0 text-primary ps-3">
                      <FaUser />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="py-2 border-start-0 bg-light text-dark auth-input-control"
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label className="fw-semibold small text-uppercase text-muted auth-label">
                    Password
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light border-end-0 text-primary ps-3">
                      <FaLock />
                    </InputGroup.Text>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="py-2 border-start-0 bg-light text-dark auth-input-control"
                    />
                  </InputGroup>
                </Form.Group>

                <div className="mb-4 text-end">
                  <Button
                    variant="link"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-muted p-0 text-decoration-none small hover-text-primary auth-password-toggle"
                  >
                    {showPassword ? (
                      <>
                        <FaEyeSlash className="me-1" /> Hide Password
                      </>
                    ) : (
                      <>
                        <FaEye className="me-1" /> Show Password
                      </>
                    )}
                  </Button>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 rounded-pill fw-bold text-white shadow py-2 border-0 auth-login-btn"
                  >
                    Login
                  </Button>
                </motion.div>

                <div className="d-flex align-items-center my-3">
                  <div className="flex-grow-1 border-bottom auth-divider-line"></div>
                  <span className="mx-3 text-muted small fw-semibold text-uppercase">
                    Or
                  </span>
                  <div className="flex-grow-1 border-bottom auth-divider-line"></div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="light"
                    className="w-100 rounded-pill fw-bold text-dark shadow-sm py-2 border auth-google-btn"
                    onClick={() => googleLoginHelper()}
                  >
                    <FcGoogle className="me-2" size={20} />
                    Sign in with Google
                  </Button>
                </motion.div>
              </Form>

              <div className="text-center mt-5">
                <p className="mb-0 text-secondary small">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-primary fw-bold text-decoration-none"
                  >
                    Sign Up
                  </Link>
                </p>
                <p className="mb-0 text-secondary small mt-3">
                  Are you an official?{" "}
                  <Link
                    to="/admin-login"
                    className="text-danger fw-bold text-decoration-none"
                  >
                    Admin Login
                  </Link>
                  <span className="mx-2">|</span>
                  <Link
                    to="/contractor-login"
                    className="text-info fw-bold text-decoration-none"
                  >
                    Contractor Login
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

export default Login;
