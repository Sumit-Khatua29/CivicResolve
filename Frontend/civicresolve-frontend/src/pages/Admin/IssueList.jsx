import React, { useState, useEffect } from "react";
import {
  Table,
  Badge,
  Dropdown,
  Alert,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import { motion } from "framer-motion";
import { FaFilter } from "react-icons/fa";
import IssueService from "../../services/issue.service";
import AdminService from "../../services/admin.service";

import { useNavigate, useOutletContext } from "react-router-dom";
import "./IssueList.css";

const IssueList = () => {
  const { setStats } = useOutletContext() || {};
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [targetStatus, setTargetStatus] = useState(null);
  const [remark, setRemark] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [contractors, setContractors] = useState([]);
  const [selectedContractor, setSelectedContractor] = useState("");

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const response = await IssueService.getAllIssues();
      const data = Array.isArray(response.data) ? response.data : [];
      setIssues(data);
      setFilteredIssues(data);

      // Update stats if function provided
      if (setStats) {
        setStats({
          total: data.length,
          resolved: data.filter((i) => i.status === "RESOLVED").length,
          verified: data.filter((i) => i.status === "VERIFIED").length,
          pending: data.filter(
            (i) =>
              i.status === "PENDING" ||
              i.status === "IN_PROGRESS" ||
              i.status === "COMPLETED_PENDING_APPROVAL",
          ).length, // Grouping for simple stat
          rejected: data.filter((i) => i.status === "REJECTED").length,
        });
      }
    } catch (error) {
      setError("Failed to fetch issues.");
      console.error("Error fetching issues", error);
    }
  };

  useEffect(() => {
    if (filter === "ALL") {
      setFilteredIssues(issues);
    } else {
      setFilteredIssues(issues.filter((i) => i.status === filter));
    }
  }, [filter, issues]);

  const openStatusModal = (id, newStatus) => {
    setSelectedIssueId(id);
    setTargetStatus(newStatus);
    setRemark("");
    setShowStatusModal(true);
  };

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReviewIssue, setSelectedReviewIssue] = useState(null);

  const openReviewModal = (issue) => {
    setSelectedReviewIssue(issue);
    setRemark(""); // Reset remark
    setShowReviewModal(true);
  };

  const handleReviewAction = async (status) => {
    // If rejecting/requesting changes, maybe require a remark?
    // For now just pass it through similarly to confirmStatusChange but using the review issue
    if (!selectedReviewIssue) return;

    console.log("Review Action:", status, "Issue:", selectedReviewIssue.id);
    try {
      await IssueService.updateStatus(selectedReviewIssue.id, status, remark);
      fetchIssues();
      setShowReviewModal(false);
      if (status === "RESOLVED") {
        // Optional success message
      }
    } catch (error) {
      setError("Failed to update status.");
    }
  };

  const confirmStatusChange = async () => {
    console.log(
      "Updating status:",
      selectedIssueId,
      targetStatus,
      "Remark:",
      remark,
    );
    try {
      await IssueService.updateStatus(selectedIssueId, targetStatus, remark);
      fetchIssues();
      setShowStatusModal(false);
    } catch (error) {
      setError("Failed to update status.");
      console.error("Error updating status", error);
    }
  };

  const fetchContractors = async () => {
    try {
      const response = await AdminService.getApprovedContractors();
      setContractors(response.data);
    } catch (error) {
      console.error("Error fetching contractors", error);
    }
  };

  const openAssignModal = (id) => {
    setSelectedIssueId(id);
    setSelectedContractor("");
    fetchContractors();
    setShowAssignModal(true);
  };

  const confirmAssignment = async () => {
    if (!selectedContractor) {
      alert("Please select a contractor");
      return;
    }
    try {
      await IssueService.assignIssue(selectedIssueId, selectedContractor);
      fetchIssues();
      setShowAssignModal(false);
    } catch (error) {
      console.error("Error assigning contractor", error);
      setError("Failed to assign contractor");
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      RESOLVED: { bg: "success", label: "Resolved" },
      IN_PROGRESS: { bg: "warning", label: "In Progress" },
      VERIFIED: { bg: "info", label: "Verified" },
      PENDING: { bg: "warning", label: "Pending" },
      COMPLETED_PENDING_APPROVAL: { bg: "info", label: "Pending Approval" },
      REJECTED: { bg: "danger", label: "Rejected" },
    };
    const type = config[status] || { bg: "secondary", label: status };

    // Use custom css classes mapped from index.css
    return (
      <Badge
        bg={type.bg}
        className={`badge-custom badge-${type.label.toLowerCase().replace(" ", "-")}`}
      >
        {type.label}
      </Badge>
    );
  };

  return (
    <div className="glass-card">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0 fw-bold bg-gradient-primary-to-secondary text-transparent bg-clip-text">
          Recent Issues
        </h4>
        <Dropdown>
          <Dropdown.Toggle
            variant="light"
            id="filter-dropdown"
            className="filter-dropdown-toggle"
          >
            <FaFilter className="me-2 text-primary" /> Filter: {filter}
          </Dropdown.Toggle>
          <Dropdown.Menu className="shadow-lg border-0 rounded-4 mt-2">
            <Dropdown.Item onClick={() => setFilter("ALL")}>All</Dropdown.Item>
            <Dropdown.Item onClick={() => setFilter("PENDING")}>
              Pending
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setFilter("VERIFIED")}>
              Verified
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setFilter("IN_PROGRESS")}>
              In Progress
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => setFilter("COMPLETED_PENDING_APPROVAL")}
            >
              Pending Approval
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setFilter("RESOLVED")}>
              Resolved
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setFilter("REJECTED")}>
              Rejected
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="table-responsive">
        <Table className="table-premium align-middle mb-0">
          <thead>
            <tr>
              <th className="issue-col-width ps-4">ID</th>
              <th className="issue-col-width">Description</th>
              <th className="issue-col-width">Category</th>
              <th className="issue-col-width">Address</th>
              <th className="issue-col-width">Reported By</th>
              <th className="issue-col-width">Status</th>
              <th className="issue-col-width">Date</th>
              <th className="issue-col-width pe-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredIssues.map((issue, index) => (
              <motion.tr
                key={issue.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <td className="fw-bold text-secondary ps-4">#{issue.id}</td>
                <td>
                  <div className="d-flex flex-column">
                    <span className="issue-description">
                      {issue.description}
                    </span>
                    {issue.imagePath && (
                      <a
                        href={issue.imagePath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-decoration-none small mt-1"
                      >
                        View Attachment
                      </a>
                    )}
                  </div>
                </td>
                <td>
                  <Badge bg="light" text="dark" className="border shadow-sm">
                    {issue.category === "OTHER" && issue.otherCategory
                      ? issue.otherCategory
                      : issue.category}
                  </Badge>
                </td>
                <td>
                  <span className="small text-muted">
                    {issue.address || "-"}
                  </span>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2 issue-avatar shadow-sm">
                      {issue.reportedBy?.charAt(0).toUpperCase()}
                    </div>
                    <span className="fw-medium text-dark">
                      {issue.reportedBy}
                    </span>
                  </div>
                </td>
                <td>{getStatusBadge(issue.status)}</td>
                <td className="text-muted small">
                  {new Date(issue.createdAt).toLocaleDateString()} <br />
                  <span className="text-xs text-secondary">
                    {new Date(issue.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </td>
                <td className="pe-4">
                  <Dropdown drop="start">
                    <Dropdown.Toggle
                      size="sm"
                      variant="white"
                      className="btn-icon"
                      disabled={issue.status === "RESOLVED"}
                    >
                      •••
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="shadow border-0 rounded-3">
                      <Dropdown.Header>Change Status</Dropdown.Header>
                      <Dropdown.Item
                        onClick={() => openStatusModal(issue.id, "VERIFIED")}
                        disabled={[
                          "VERIFIED",
                          "IN_PROGRESS",
                          "RESOLVED",
                          "REJECTED",
                        ].includes(issue.status)}
                      >
                        Mark Verified
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => openAssignModal(issue.id)}
                        disabled={issue.status !== "VERIFIED"}
                        title={
                          issue.status !== "VERIFIED"
                            ? "Issue must be verified before assignment"
                            : "Assign to Contractor"
                        }
                        // Hide if pending approval, as it's already done
                        className={
                          issue.status === "COMPLETED_PENDING_APPROVAL"
                            ? "d-none"
                            : ""
                        }
                      >
                        Assign Contractor
                      </Dropdown.Item>

                      {/* Admin Verification Actions */}
                      {issue.status === "COMPLETED_PENDING_APPROVAL" && (
                        <>
                          <Dropdown.Item
                            onClick={() => openReviewModal(issue)}
                            className="fw-bold text-primary"
                          >
                            Review Evidence & Approve
                          </Dropdown.Item>
                          <Dropdown.Divider />
                        </>
                      )}

                      <Dropdown.Item
                        onClick={() => openStatusModal(issue.id, "RESOLVED")}
                        disabled={[
                          "RESOLVED",
                          "REJECTED",
                          "COMPLETED_PENDING_APPROVAL",
                        ].includes(issue.status)}
                      >
                        Mark Resolved
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item
                        onClick={() => openStatusModal(issue.id, "REJECTED")}
                        className="text-danger"
                        disabled={["RESOLVED", "REJECTED"].includes(
                          issue.status,
                        )}
                      >
                        Reject Issue
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
              </motion.tr>
            ))}
            {filteredIssues.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-5">
                  <div className="empty-state-message py-4 mx-auto w-50">
                    <p className="mb-0 text-muted fw-bold">
                      No issues found matching criteria.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <Modal
        show={showStatusModal}
        onHide={() => setShowStatusModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Issue Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>
              Status: <strong>{targetStatus}</strong>
            </Form.Label>
            <Form.Label className="mt-3">Add a Remark (optional):</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="e.g. Work is satisfactory / Please fix the pavement edges..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmStatusChange}>
            Update Status
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showAssignModal}
        onHide={() => setShowAssignModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Assign Contractor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Select Contractor:</Form.Label>
            {contractors.length === 0 ? (
              <Alert variant="warning">No approved contractors found.</Alert>
            ) : (
              <Form.Select
                value={selectedContractor}
                onChange={(e) => setSelectedContractor(e.target.value)}
              >
                <option value="">-- Select Contractor --</option>
                {contractors.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.fullName} - {c.assignedArea}
                  </option>
                ))}
              </Form.Select>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAssignModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={confirmAssignment}
            disabled={!selectedContractor}
          >
            Assign & Start
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Review Evidence Modal */}
      <Modal
        show={showReviewModal}
        onHide={() => setShowReviewModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Review Contractor Evidence</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReviewIssue && (
            <div>
              <div className="mb-4">
                <h6>Description</h6>
                <p className="text-muted">{selectedReviewIssue.description}</p>
              </div>

              <div className="row text-center mb-4">
                <div className="col-md-6 mb-3">
                  <h6 className="fw-bold text-secondary">Before Work</h6>
                  {selectedReviewIssue.beforeImagePath ? (
                    <img
                      src={selectedReviewIssue.beforeImagePath}
                      alt="Before"
                      className="img-fluid rounded border shadow-sm"
                      style={{ maxHeight: "250px", objectFit: "cover" }}
                    />
                  ) : (
                    <div className="p-5 bg-light border rounded text-muted">
                      No Image
                    </div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <h6 className="fw-bold text-success">After Work</h6>
                  {selectedReviewIssue.afterImagePath ? (
                    <img
                      src={selectedReviewIssue.afterImagePath}
                      alt="After"
                      className="img-fluid rounded border shadow-sm"
                      style={{ maxHeight: "250px", objectFit: "cover" }}
                    />
                  ) : (
                    <div className="p-5 bg-light border rounded text-muted">
                      No Image
                    </div>
                  )}
                </div>
              </div>

              <Form.Group className="mb-3">
                <Form.Label>
                  Admin Remarks (for Rejection/Improvements):
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="Enter feedback only if requesting improvements..."
                />
              </Form.Group>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <Button
            variant="outline-secondary"
            onClick={() => setShowReviewModal(false)}
          >
            Close
          </Button>
          <div>
            <Button
              variant="warning"
              className="me-2"
              onClick={() => handleReviewAction("IN_PROGRESS")}
            >
              Request Improvements
            </Button>
            <Button
              variant="success"
              onClick={() => handleReviewAction("RESOLVED")}
            >
              Approve & Resolve
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default IssueList;
