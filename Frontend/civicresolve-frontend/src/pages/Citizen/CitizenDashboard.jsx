import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Badge,
  Button,
  Alert,
  Row,
  Col,
  Card,
  Modal,
} from "react-bootstrap";
import IssueService from "../../services/issue.service";
import { Link } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaExclamationCircle,
  FaClock,
  FaTimesCircle,
  FaMapMarkedAlt,
  FaList,
  FaEye,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./CitizenDashboard.css";

// Fix for default marker icon issues in some bundlers
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Initial center (India) - will be overridden by MapBounds if issues exist
const defaultCenter = [20.5937, 78.9629];

const createCustomIcon = (issue) => {
  return L.divIcon({
    className: "custom-marker-icon",
    html: `
          <div class="marker-pin">
            <div class="marker-pin-inner">
              ${getImageOrEmoji(issue)}
            </div>
          </div>
        `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};

const createClusterCustomIcon = (cluster) => {
  return L.divIcon({
    html: `
            <div class="cluster-marker">
                <span>${cluster.getChildCount()}</span>
            </div>
        `,
    className: "custom-cluster-icon",
    iconSize: L.point(40, 40, true),
  });
};

const getImageOrEmoji = (issue) => {
  if (issue.imagePath) {
    return `<img src="${issue.imagePath}" alt="Issue" class="marker-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" /><span style="display:none">📍</span>`;
  }
  switch (issue.category) {
    case "POTHOLE":
      return "🕳️";
    case "GARBAGE":
      return "🗑️";
    case "WATER_LEAKAGE":
      return "💧";
    case "STREET_LIGHT":
      return "💡";
    default:
      return "📍";
  }
};

// Component to handle dynamic map centering
const MapBounds = ({ issues }) => {
  const map = useMap();

  useEffect(() => {
    if (issues.length > 0) {
      const bounds = L.latLngBounds(
        issues.map((issue) => [
          parseFloat(issue.latitude),
          parseFloat(issue.longitude),
        ]),
      );
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [issues, map]);

  return null;
};

const CitizenDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    verified: 0,
    pending: 0,
    rejected: 0,
  });
  const [showMap, setShowMap] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const response = await IssueService.getMyIssues();
      const data = Array.isArray(response.data) ? response.data : [];
      setIssues(data);

      setStats({
        total: data.length,
        resolved: data.filter((i) => i.status === "RESOLVED").length,
        verified: data.filter((i) => i.status === "VERIFIED").length,
        pending: data.filter(
          (i) => i.status === "PENDING" || i.status === "IN_PROGRESS",
        ).length,
        rejected: data.filter((i) => i.status === "REJECTED").length,
      });
    } catch (error) {
      setError("Failed to fetch your issues.");
      console.error("Error fetching issues", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this issue?")) {
      try {
        await IssueService.deleteIssue(id);
        fetchIssues(); // Refresh list
      } catch (error) {
        console.error("Error deleting issue", error);
        setError("Failed to delete issue.");
      }
    }
  };

  const StatCard = ({ title, count, variant, icon }) => (
    <motion.div whileHover={{ y: -5 }}>
      <Card className={`border-0 shadow-sm mb-4 bg-white`}>
        <Card.Body className="d-flex align-items-center">
          <div
            className={`rounded-circle bg-${variant} bg-opacity-10 p-3 me-3 text-${variant}`}
          >
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

  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState(null);

  const handleShowEvidence = (issue) => {
    setSelectedEvidence(issue);
    setShowEvidenceModal(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container className="citizen-dashboard-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0 fw-bold">My Dashboard</h2>
        </div>

        <Row className="mb-4 g-3">
          <Col xs={12} sm={6} md={3}>
            <StatCard
              title="Total Reported"
              count={stats.total}
              variant="primary"
              icon={<FaExclamationCircle size={24} />}
            />
          </Col>
          <Col xs={12} sm={6} md={2}>
            <StatCard
              title="Resolved"
              count={stats.resolved}
              variant="success"
              icon={<FaCheckCircle size={24} />}
            />
          </Col>
          <Col xs={12} sm={6} md={2}>
            <StatCard
              title="Verified"
              count={stats.verified}
              variant="info"
              icon={<FaCheckCircle size={24} />}
            />
          </Col>
          <Col xs={12} sm={6} md={2}>
            <StatCard
              title="Pending"
              count={stats.pending}
              variant="warning"
              icon={<FaClock size={24} />}
            />
          </Col>
          <Col xs={12} sm={6} md={3}>
            <StatCard
              title="Rejected"
              count={stats.rejected}
              variant="danger"
              icon={<FaTimesCircle size={24} />}
            />
          </Col>
        </Row>

        <div className="glass-card">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0">Recent Issues</h4>
            <div>
              <Button
                variant="outline-primary"
                className="me-3 btn-premium-outline"
                onClick={() => setShowMap(!showMap)}
              >
                {showMap ? (
                  <>
                    <FaList className="me-2" /> Hide Map
                  </>
                ) : (
                  <>
                    <FaMapMarkedAlt className="me-2" /> Show Map
                  </>
                )}
              </Button>
              <Link to="/report-issue">
                <Button variant="primary" className="btn-premium">
                  Report New Issue
                </Button>
              </Link>
            </div>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <AnimatePresence>
            {showMap && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-4"
              >
                <div className="map-view-container border rounded overflow-hidden">
                  <MapContainer
                    center={defaultCenter}
                    zoom={5}
                    className="map-container-full"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapBounds issues={issues} />
                    <MarkerClusterGroup
                      chunkedLoading
                      iconCreateFunction={createClusterCustomIcon}
                    >
                      {issues.map(
                        (issue) =>
                          issue.latitude &&
                          issue.longitude && (
                            <Marker
                              key={issue.id}
                              position={[
                                parseFloat(issue.latitude),
                                parseFloat(issue.longitude),
                              ]}
                              icon={createCustomIcon(issue)}
                            >
                              <Popup>
                                <div className="popup-content">
                                  <h6 className="mb-1 fw-bold">
                                    {issue.category}
                                  </h6>
                                  <p className="small mb-1 text-muted">
                                    {issue.description.substring(0, 50)}...
                                  </p>
                                  <Badge
                                    bg={
                                      issue.status === "RESOLVED"
                                        ? "success"
                                        : issue.status === "VERIFIED"
                                          ? "info"
                                          : issue.status === "IN_PROGRESS"
                                            ? "warning"
                                            : issue.status === "REJECTED"
                                              ? "danger"
                                              : "secondary"
                                    }
                                  >
                                    {issue.status}
                                  </Badge>
                                  <div className="mt-2">
                                    <Link
                                      to={`/edit-issue/${issue.id}`}
                                      className="text-decoration-none small"
                                    >
                                      View Details
                                    </Link>
                                  </div>
                                </div>
                              </Popup>
                            </Marker>
                          ),
                      )}
                    </MarkerClusterGroup>
                  </MapContainer>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {issues.length === 0 ? (
            <p className="text-muted text-center py-5">
              You haven't reported any issues yet.
            </p>
          ) : (
            <Table hover responsive className="table-premium bg-transparent">
              <thead>
                <tr>
                  <th className="issue-table-th">#</th>
                  <th className="issue-table-th">Description</th>
                  <th className="issue-table-th">Image</th>
                  <th className="issue-table-th">Category</th>
                  <th className="issue-table-th">Address</th>
                  <th className="issue-table-th">Status</th>
                  <th className="issue-table-th">Date</th>
                  <th className="issue-table-th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue, index) => (
                  <motion.tr
                    key={issue.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <td>{issue.id}</td>
                    <td>{issue.description}</td>
                    <td>
                      {issue.imagePath ? (
                        <div className="mt-1">
                          <a
                            href={issue.imagePath}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Image
                          </a>
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      <Badge bg="secondary" className="badge-custom">
                        {issue.category === "OTHER" && issue.otherCategory
                          ? issue.otherCategory
                          : issue.category}
                      </Badge>
                    </td>
                    <td>{issue.address}</td>
                    <td>
                      <Badge
                        className={`badge-custom badge-${issue.status ? issue.status.toLowerCase().replace("_", "-") : "secondary"}`}
                        bg={
                          issue.status === "RESOLVED"
                            ? "success"
                            : issue.status === "VERIFIED"
                              ? "info"
                              : issue.status === "IN_PROGRESS"
                                ? "warning"
                                : issue.status === "REJECTED"
                                  ? "danger"
                                  : "secondary"
                        }
                      >
                        {issue.status || "Pending"}
                      </Badge>
                    </td>
                    <td>
                      {new Date(issue.createdAt).toLocaleDateString()} <br />
                      <span className="text-xs text-secondary">
                        {new Date(issue.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        {issue.status === "PENDING" ? (
                          <Link
                            to={`/edit-issue/${issue.id}`}
                            className="btn btn-sm btn-outline-primary"
                            title="Edit Issue"
                          >
                            <FaEdit />
                          </Link>
                        ) : (
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            disabled
                            title="Cannot edit after verification"
                          >
                            <FaEdit />
                          </Button>
                        )}
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(issue.id)}
                          title="Delete Issue"
                          disabled={[
                            "PENDING",
                            "VERIFIED",
                            "IN_PROGRESS",
                          ].includes(issue.status)}
                        >
                          <FaTrash />
                        </Button>
                        {issue.status === "RESOLVED" && (
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => handleShowEvidence(issue)}
                            title="View Resolution Evidence"
                          >
                            <FaEye />
                          </Button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>

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
                    <strong>Issue Description:</strong>{" "}
                    {selectedEvidence.description}
                  </Col>
                </Row>
                <Row className="mb-4">
                  <Col>
                    <strong>Contractor Remarks:</strong>{" "}
                    {selectedEvidence.remark || "No remarks provided."}
                  </Col>
                </Row>
                <Row>
                  <Col md={6} className="mb-3 text-center">
                    <h6>Before Work</h6>
                    {selectedEvidence.beforeImagePath ? (
                      <img
                        src={selectedEvidence.beforeImagePath}
                        alt="Before Work"
                        className="img-thumbnail img-fluid"
                        style={{ maxHeight: "300px" }}
                      />
                    ) : (
                      <div
                        className="text-muted border rounded p-4 bg-light d-flex align-items-center justify-content-center"
                        style={{ height: "150px" }}
                      >
                        No Image Available
                      </div>
                    )}
                  </Col>
                  <Col md={6} className="mb-3 text-center">
                    <h6>After Work</h6>
                    {selectedEvidence.afterImagePath ? (
                      <img
                        src={selectedEvidence.afterImagePath}
                        alt="After Work"
                        className="img-thumbnail img-fluid"
                        style={{ maxHeight: "300px" }}
                      />
                    ) : (
                      <div
                        className="text-muted border rounded p-4 bg-light d-flex align-items-center justify-content-center"
                        style={{ height: "150px" }}
                      >
                        No Resolution Image
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
    </motion.div>
  );
};
export default CitizenDashboard;
