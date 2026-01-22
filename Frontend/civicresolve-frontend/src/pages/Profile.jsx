import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import UserService from "../services/user.service";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSave, FaEdit, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import "./Profile.css";

const Profile = () => {
    const { currentUser } = useContext(AuthContext);
    const [profile, setProfile] = useState({
        username: "",
        email: "",
        fullName: "",
        phoneNumber: "",
        address: "",
        role: "",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await UserService.getProfile();
            setProfile(response.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to load profile. Please try again.");
            setLoading(false);
            console.error(err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");
        setError("");

        try {
            const response = await UserService.updateProfile({
                fullName: profile.fullName,
                phoneNumber: profile.phoneNumber,
                address: profile.address,
            });
            // Update local profile with response to ensure sync
            setProfile(prev => ({
                ...prev,
                ...response.data
            }));
            setMessage("Profile updated successfully!");
            setSaving(false);
            setIsEditing(false); // Switch back to view mode on success
        } catch (err) {
            setError("Failed to update profile. Please try again.");
            setSaving(false);
            console.error(err);
        }
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
        setMessage("");
        setError("");
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center profile-loading-container">
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    // Check if profile is considered "complete" (has full name)
    const isProfileComplete = !!profile.fullName;

    return (
        <div className="profile-container">
            <Container className="pb-5">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
                            <div className="bg-primary p-4 text-center text-white position-relative profile-header-gradient">
                                <div className="mb-3">
                                    <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center shadow profile-avatar-wrapper">
                                        <FaUser className="text-primary" size={40} />
                                    </div>
                                </div>
                                <h3 className="fw-bold mb-0">{profile.username}</h3>
                                <p className="opacity-75 mb-0">{profile.role}</p>
                            </div>
                            <Card.Body className="p-4 p-md-5">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h4 className="fw-bold text-secondary mb-0">
                                        {isEditing
                                            ? (isProfileComplete ? "Edit Profile" : "Create Profile")
                                            : "Profile Details"
                                        }
                                    </h4>
                                    {!isEditing && (
                                        <Button
                                            variant="outline-primary"
                                            onClick={toggleEdit}
                                            className="rounded-pill d-flex align-items-center"
                                        >
                                            {isProfileComplete ? (
                                                <><FaEdit className="me-2" /> Edit</>
                                            ) : (
                                                <><FaUser className="me-2" /> Complete Profile</>
                                            )}
                                        </Button>
                                    )}
                                </div>

                                {message && <Alert variant="success" className="rounded-3 shadow-sm">{message}</Alert>}
                                {error && <Alert variant="danger" className="rounded-3 shadow-sm">{error}</Alert>}

                                {!isEditing ? (
                                    // VIEW MODE
                                    <div className="profile-view">

                                        <div className="mb-3 border-bottom pb-2">
                                            <div className="text-muted small fw-bold text-uppercase">Email</div>
                                            <div className="fs-5 text-dark">{profile.email}</div>
                                        </div>

                                        {isProfileComplete ? (
                                            <>
                                                <div className="mb-3 border-bottom pb-2">
                                                    <div className="text-muted small fw-bold text-uppercase">Full Name</div>
                                                    <div className="fs-5 text-dark">{profile.fullName}</div>
                                                </div>
                                                <div className="mb-3 border-bottom pb-2">
                                                    <div className="text-muted small fw-bold text-uppercase">Phone</div>
                                                    <div className="fs-5 text-dark">{profile.phoneNumber || "N/A"}</div>
                                                </div>
                                                <div className="mb-3">
                                                    <div className="text-muted small fw-bold text-uppercase">Address</div>
                                                    <div className="fs-5 text-dark">{profile.address || "N/A"}</div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="alert alert-light border-0 shadow-sm text-center py-4">
                                                <p className="text-muted mb-3">Your profile is incomplete. Please add more details.</p>
                                                <Button variant="primary" onClick={toggleEdit} className="rounded-pill">
                                                    Complete Profile
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    // EDIT MODE
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group className="mb-3" controlId="formFullName">
                                            <Form.Label className="fw-semibold text-muted"><FaUser className="me-2" />Full Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="fullName"
                                                value={profile.fullName || ""}
                                                onChange={handleChange}
                                                placeholder="Enter your full name"
                                                className="rounded-3 py-2"
                                                required
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="formEmail">
                                            <Form.Label className="fw-semibold text-muted"><FaEnvelope className="me-2" />Email Address</Form.Label>
                                            <Form.Control
                                                type="email"
                                                value={profile.email || ""}
                                                disabled
                                                className="bg-light rounded-3 py-2"
                                            />
                                            <Form.Text className="text-muted">
                                                Email cannot be changed.
                                            </Form.Text>
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="formPhoneNumber">
                                            <Form.Label className="fw-semibold text-muted"><FaPhone className="me-2" />Phone Number</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="phoneNumber"
                                                value={profile.phoneNumber || ""}
                                                onChange={handleChange}
                                                placeholder="Enter your phone number"
                                                className="rounded-3 py-2"
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-4" controlId="formAddress">
                                            <Form.Label className="fw-semibold text-muted"><FaMapMarkerAlt className="me-2" />Address</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                name="address"
                                                value={profile.address || ""}
                                                onChange={handleChange}
                                                placeholder="Enter your address"
                                                className="rounded-3 py-2"
                                            />
                                        </Form.Group>

                                        <div className="d-flex gap-2">
                                            <Button
                                                variant="outline-secondary"
                                                className="rounded-pill py-2 fw-bold flex-grow-1"
                                                onClick={toggleEdit}
                                                disabled={saving}
                                            >
                                                <FaTimes className="me-2" /> Cancel
                                            </Button>
                                            <Button
                                                variant="primary"
                                                type="submit"
                                                disabled={saving}
                                                className="rounded-pill py-2 fw-bold shadow-sm flex-grow-1"
                                            >
                                                {saving ? (
                                                    <>
                                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaSave className="me-2" /> {isProfileComplete ? "Save Changes" : "Create Profile"}
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </Form>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </motion.div>
            </Container>
        </div>
    );
};

export default Profile;
