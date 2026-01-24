import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Card,
  Table,
  Badge,
  Button,
  Row,
  Col,
  Alert,
  Spinner,
  Modal,
  Form,
  Image,
} from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import {
  FaClipboardList,
  FaCheckCircle,
  FaExclamationCircle,
  FaClock,
  FaTimesCircle,
  FaUpload,
  FaEye,
} from "react-icons/fa";
import { motion } from "framer-motion";
import "./ContractorDashboard.css";

const ContractorDashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    verified: 0,
    pending: 0,
    rejected: 0,
  });

  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [resolveData, setResolveData] = useState({
    beforeImage: null,
    afterImage: null,
    remark: "",
  });
  const [resolveLoading, setResolveLoading] = useState(false);

  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState(null);

  useEffect(() => {
    fetchAssignedIssues();
  }, []);

  const fetchAssignedIssues = async () => {
    try {
      setLoading(true);
      const response = await api.get("/issues/contractor");
      setIssues(response.data);

      const data = response.data;
      setStats({
        total: data.length,
        resolved: data.filter((i) => i.status === "RESOLVED").length,
        verified: data.filter((i) => i.status === "VERIFIED").length,
        pending: data.filter(
          (i) =>
            i.status === "PENDING" ||
            i.status === "IN_PROGRESS" ||
            i.status === "OPEN" ||
            i.status === "COMPLETED_PENDING_APPROVAL",
        ).length,
        rejected: data.filter((i) => i.status === "REJECTED").length,
      });

      setLoading(false);
    } catch (err) {
      console.error("Error fetching assigned issues:", err);
      setError("Failed to load assigned issues.");
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (issueId, newStatus) => {
    try {
      await api.put(`/issues/${issueId}/status`, null, {
        params: { status: newStatus },
      });
      setSuccess(`Issue marked as ${newStatus}`);
      fetchAssignedIssues(); // Refresh list
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error updating status:", err);
      setError("Failed to update status.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const openResolveModal = (issueId) => {
    setSelectedIssueId(issueId);
    setResolveData({ beforeImage: null, afterImage: null, remark: "" });
    setShowResolveModal(true);
  };

  const openEvidenceModal = (issue) => {
    setSelectedEvidence(issue);
    setShowEvidenceModal(true);
  };

  const handleFileChange = (e, type) => {
    if (e.target.files && e.target.files[0]) {
      setResolveData({ ...resolveData, [type]: e.target.files[0] });
    }
  };

  const handleResolveSubmit = async () => {
    if (!selectedIssueId) return;
    setResolveLoading(true);

    try {
      const formData = new FormData();
      formData.append("status", "COMPLETED_PENDING_APPROVAL");
      if (resolveData.remark) formData.append("remark", resolveData.remark);
      if (resolveData.beforeImage)
        formData.append("beforeImage", resolveData.beforeImage);
      if (resolveData.afterImage)
        formData.append("afterImage", resolveData.afterImage);

      await api.put(`/issues/${selectedIssueId}/status`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Issue submitted for Admin approval!");
      setShowResolveModal(false);
      fetchAssignedIssues();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error resolving issue:", err);
      setError("Failed to resolve issue.");
    } finally {
      setResolveLoading(false);
    }
  };

  const StatCard = ({ title, count, variant, icon }) => (
    <motion.div whileHover={{ y: -5 }}>
      <Card className="contractor-stat-card">
        <Card.Body className="d-flex align-items-center">
          <div className={`contractor-stat-icon-wrapper icon-${variant}`}>
            {icon}
          </div>
          <div>
            <h6 className="text-muted mb-0">{title}</h6>
            <h3 className="fw-bold mb-0">{count}</h3>
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );

  if (loading) {
    return (
      <Container className="contractor-dashboard-loading">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="contractor-dashboard-container">
      <Row className="mb-4">
        <Col>
          <h2 className="contractor-dashboard-title">
            <FaClipboardList className="me-2 text-primary" />
            Contractor Dashboard
          </h2>
          <p className="text-muted">
            Welcome back, {currentUser?.username}. Here are your assigned tasks.
          </p>
        </Col>
      </Row>

      <Row className="mb-4 g-3">
        <Col xs={12} sm={6} md={6}>
          <StatCard
            title="Total Assigned"
            count={stats.total}
            variant="primary"
            icon={<FaExclamationCircle size={24} />}
          />
        </Col>
        <Col xs={12} sm={6} md={6}>
          <StatCard
            title="Resolved"
            count={stats.resolved}
            variant="success"
            icon={<FaCheckCircle size={24} />}
          />
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Card className="contractor-dashboard-card">
        <Card.Body className="p-0">
          {issues.length === 0 ? (
            <div className="contractor-dashboard-empty-state">
              <FaCheckCircle className="text-success mb-3" size={40} />
              <h5 className="text-muted">
                All caught up! No assigned issues properly.
              </h5>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle mb-0">
                <thead className="contractor-dashboard-table-thead">
                  <tr>
                    <th className="contractor-dashboard-th ps-4 border-0">
                      Issue ID
                    </th>
                    <th className="contractor-dashboard-th border-0">
                      Description
                    </th>
                    <th className="contractor-dashboard-th border-0">Area</th>
                    <th className="contractor-dashboard-th border-0">Status</th>
                    <th className="contractor-dashboard-th border-0">
                      Date Assigned
                    </th>
                    <th className="contractor-dashboard-th pe-4 border-0 text-end">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {issues.map((issue) => (
                    <tr key={issue.id}>
                      <td className="contractor-dashboard-td-id">
                        #{issue.id}
                      </td>
                      <td>{issue.description}</td>
                      <td>{issue.pincode}</td>
                      <td>
                        <Badge
                          bg={
                            issue.status === "RESOLVED"
                              ? "success"
                              : issue.status === "COMPLETED_PENDING_APPROVAL"
                                ? "info"
                                : issue.status === "IN_PROGRESS"
                                  ? "warning"
                                  : "secondary"
                          }
                          className="px-3 py-2 rounded-pill fw-normal"
                        >
                          {issue.status === "COMPLETED_PENDING_APPROVAL"
                            ? "Pending Approval"
                            : issue.status}
                        </Badge>
                      </td>
                      <td className="text-muted small">
                        {new Date(issue.updatedAt).toLocaleDateString()}
                        <br />
                        <span className="text-xs text-secondary">
                          {new Date(issue.updatedAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      </td>
                      <td className="pe-4 text-end">
                        {issue.status !== "RESOLVED" && (
                          <div className="d-flex gap-2 justify-content-end">
                            {(issue.status === "OPEN" ||
                              issue.status === "PENDING") && (
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() =>
                                  handleStatusUpdate(issue.id, "IN_PROGRESS")
                                }
                              >
                                Start Work
                              </Button>
                            )}
                            {issue.status === "IN_PROGRESS" && (
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() => openResolveModal(issue.id)}
                              >
                                <FaCheckCircle className="me-1" /> Resolve
                              </Button>
                            )}
                          </div>
                        )}
                        {issue.status === "RESOLVED" && (
                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => openEvidenceModal(issue)}
                          >
                            <FaEye className="me-1" /> View Evidence
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Resolution Modal */}
      <Modal
        show={showResolveModal}
        onHide={() => setShowResolveModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Resolve Issue & Upload Evidence</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Before Work Image (Optional)</Form.Label>
              <div className="contractor-dashboard-upload-container">
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "beforeImage")}
                  className="d-none"
                  id="before-image-upload"
                />
                <label
                  htmlFor="before-image-upload"
                  className="contractor-dashboard-upload-label"
                >
                  <FaUpload size={30} className="text-secondary mb-2" />
                  <div className="text-sm text-primary">Click to Upload</div>
                  {resolveData.beforeImage && (
                    <div className="text-success mt-1 small">
                      {resolveData.beforeImage.name}
                    </div>
                  )}
                </label>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>After Work Image (Required)</Form.Label>
              <div className="contractor-dashboard-upload-container">
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "afterImage")}
                  className="d-none"
                  id="after-image-upload"
                />
                <label
                  htmlFor="after-image-upload"
                  className="contractor-dashboard-upload-label"
                >
                  <FaUpload size={30} className="text-secondary mb-2" />
                  <div className="text-sm text-primary">Click to Upload</div>
                  {resolveData.afterImage && (
                    <div className="text-success mt-1 small">
                      {resolveData.afterImage.name}
                    </div>
                  )}
                </label>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={resolveData.remark}
                onChange={(e) =>
                  setResolveData({ ...resolveData, remark: e.target.value })
                }
                placeholder="Describe the work done..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowResolveModal(false)}
            disabled={resolveLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleResolveSubmit}
            disabled={resolveLoading}
          >
            {resolveLoading ? (
              <Spinner size="sm" animation="border" />
            ) : (
              "Submit Resolution"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Evidence Modal */}
      <Modal
        show={showEvidenceModal}
        onHide={() => setShowEvidenceModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Resolution Evidence</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvidence && (
            <div>
              <Row className="mb-4">
                <Col>
                  <strong>Description:</strong> {selectedEvidence.description}
                </Col>
              </Row>
              <Row className="mb-4">
                <Col>
                  <strong>Contractor Remarks:</strong>{" "}
                  {selectedEvidence.remark || "N/A"}
                </Col>
              </Row>
              <Row>
                <Col md={6} className="mb-3 text-center">
                  <h6>Before</h6>
                  {selectedEvidence.beforeImagePath ? (
                    <Image
                      src={selectedEvidence.beforeImagePath}
                      fluid
                      rounded
                      thumbnail
                    />
                  ) : (
                    <div className="text-muted border rounded p-5 bg-light">
                      No Image
                    </div>
                  )}
                </Col>
                <Col md={6} className="mb-3 text-center">
                  <h6>After</h6>
                  {selectedEvidence.afterImagePath ? (
                    <Image
                      src={selectedEvidence.afterImagePath}
                      fluid
                      rounded
                      thumbnail
                    />
                  ) : (
                    <div className="text-muted border rounded p-5 bg-light">
                      No Image
                    </div>
                  )}
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowEvidenceModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ContractorDashboard;
