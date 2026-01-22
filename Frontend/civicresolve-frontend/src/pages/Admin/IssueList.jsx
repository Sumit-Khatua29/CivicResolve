import React, { useState, useEffect } from "react";
import { Table, Badge, Dropdown, Alert, Button, Modal, Form } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaFilter } from "react-icons/fa";
import IssueService from "../../services/issue.service";

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
              resolved: data.filter(i => i.status === 'RESOLVED').length,
              verified: data.filter(i => i.status === 'VERIFIED').length,
              pending: data.filter(i => i.status === 'PENDING' || i.status === 'IN_PROGRESS').length, // Grouping for simple stat
              rejected: data.filter(i => i.status === 'REJECTED').length
          });
      }

    } catch (error) {
      setError("Failed to fetch issues.");
      console.error("Error fetching issues", error);
    }
  };

  useEffect(() => {
      if (filter === 'ALL') {
          setFilteredIssues(issues);
      } else {
          setFilteredIssues(issues.filter(i => i.status === filter));
      }
  }, [filter, issues]);

  const openStatusModal = (id, newStatus) => {
      setSelectedIssueId(id);
      setTargetStatus(newStatus);
      setRemark("");
      setShowStatusModal(true);
  };

  const confirmStatusChange = async () => {
      console.log("Updating status:", selectedIssueId, targetStatus, "Remark:", remark);
      try {
          await IssueService.updateStatus(selectedIssueId, targetStatus, remark);
          fetchIssues();
          setShowStatusModal(false);
      } catch (error) {
          setError("Failed to update status.");
          console.error("Error updating status", error);
      }
  };

  const getStatusBadge = (status) => {
      const config = {
          'RESOLVED': { bg: 'success', label: 'Resolved' },
          'IN_PROGRESS': { bg: 'warning', label: 'In Progress' },
          'VERIFIED': { bg: 'info', label: 'Verified' },
          'PENDING': { bg: 'warning', label: 'Pending' },
          'REJECTED': { bg: 'danger', label: 'Rejected' }
      };
      const type = config[status] || { bg: 'secondary', label: status };
      
      // Use custom css classes mapped from index.css
      return <Badge bg={type.bg} className={`badge-custom badge-${type.label.toLowerCase().replace(' ', '-')}`}>{type.label}</Badge>;
  };

  return (
    <div className="glass-card">
      <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0 fw-bold bg-gradient-primary-to-secondary text-transparent bg-clip-text">Recent Issues</h4>
          <Dropdown>
              <Dropdown.Toggle variant="light" id="filter-dropdown" className="filter-dropdown-toggle">
                  <FaFilter className="me-2 text-primary" /> Filter: {filter}
              </Dropdown.Toggle>
              <Dropdown.Menu className="shadow-lg border-0 rounded-4 mt-2">
                  <Dropdown.Item onClick={() => setFilter('ALL')}>All</Dropdown.Item>
                  <Dropdown.Item onClick={() => setFilter('PENDING')}>Pending</Dropdown.Item>
                  <Dropdown.Item onClick={() => setFilter('VERIFIED')}>Verified</Dropdown.Item>
                  <Dropdown.Item onClick={() => setFilter('IN_PROGRESS')}>In Progress</Dropdown.Item>
                  <Dropdown.Item onClick={() => setFilter('RESOLVED')}>Resolved</Dropdown.Item>
                  <Dropdown.Item onClick={() => setFilter('REJECTED')}>Rejected</Dropdown.Item>
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
                        <span className="issue-description">{issue.description}</span>
                        {issue.imagePath && (
                            <a href={issue.imagePath} target="_blank" rel="noopener noreferrer" className="text-primary text-decoration-none small mt-1">
                                View Attachment
                            </a>
                        )}
                    </div>
                </td>
                <td>
                    <Badge bg="light" text="dark" className="border shadow-sm">
                        {issue.category === 'OTHER' && issue.otherCategory ? issue.otherCategory : issue.category}
                    </Badge>
                </td>
                <td>
                    <span className="small text-muted">{issue.address || '-'}</span>
                </td>
                <td>
                    <div className="d-flex align-items-center">
                        <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2 issue-avatar shadow-sm">
                            {issue.reportedBy?.charAt(0).toUpperCase()}
                        </div>
                        <span className="fw-medium text-dark">{issue.reportedBy}</span>
                    </div>
                </td>
                <td>{getStatusBadge(issue.status)}</td>
                <td className="text-muted small">
                    {new Date(issue.createdAt).toLocaleDateString()} <br />
                    <span className="text-xs text-secondary">{new Date(issue.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true})}</span>
                </td>
                <td className="pe-4">
                    <Dropdown drop="start">
                        <Dropdown.Toggle size="sm" variant="white" className="btn-icon" disabled={issue.status === 'RESOLVED'}>
                           •••
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="shadow border-0 rounded-3">
                            <Dropdown.Header>Change Status</Dropdown.Header>
                            <Dropdown.Item 
                                onClick={() => openStatusModal(issue.id, "VERIFIED")}
                                disabled={['VERIFIED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'].includes(issue.status)}
                            >
                                Mark Verified
                            </Dropdown.Item>
                            <Dropdown.Item 
                                onClick={() => openStatusModal(issue.id, "IN_PROGRESS")}
                                disabled={['IN_PROGRESS', 'RESOLVED', 'REJECTED'].includes(issue.status)}
                            >
                                Mark In Progress
                            </Dropdown.Item>
                            <Dropdown.Item 
                                onClick={() => openStatusModal(issue.id, "RESOLVED")}
                                disabled={['RESOLVED', 'REJECTED'].includes(issue.status)}
                            >
                                Mark Resolved
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item 
                                onClick={() => openStatusModal(issue.id, "REJECTED")} 
                                className="text-danger"
                                disabled={['RESOLVED', 'REJECTED'].includes(issue.status)}
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
                            <p className="mb-0 text-muted fw-bold">No issues found matching criteria.</p>
                        </div>
                    </td>
                </tr>
            )}
            </tbody>
        </Table>
      </div>
      
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)} centered>
          <Modal.Header closeButton>
              <Modal.Title>Update Issue Status</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <Form.Group>
                  <Form.Label>Status: <strong>{targetStatus}</strong></Form.Label>
                  <Form.Label className="mt-3">Add a Remark (optional):</Form.Label>
                  <Form.Control 
                      as="textarea" 
                      rows={3} 
                      value={remark} 
                      onChange={(e) => setRemark(e.target.value)} 
                      placeholder="e.g. Issue verified, team dispatched..."
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
    </div>
  );
};

export default IssueList;
