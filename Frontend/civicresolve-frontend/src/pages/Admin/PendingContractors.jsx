import React, { useState, useEffect } from "react";
import { Container, Table, Button, Alert, Card, Badge } from "react-bootstrap";
import api from "../../services/api";
import AdminService from "../../services/admin.service";
import { FaCheckCircle, FaUserClock, FaTrash } from "react-icons/fa";
import "./PendingContractors.css";

const PendingContractors = () => {
  const [contractors, setContractors] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchPendingContractors(); // Initial fetch
  }, []);

  const fetchPendingContractors = async () => {
    try {
      const response = await api.get("/admin/contractors/pending");
      setContractors(response.data);
    } catch (err) {
      console.error("Error fetching pending contractors:", err);
      setError("Failed to load pending contractors.");
    }
  };

  const handleApprove = async (contractorId) => {
    try {
      await AdminService.approveContractor(contractorId);
      setSuccess("Contractor approved successfully!");
      fetchPendingContractors(); // Refresh list
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error approving contractor:", err);
      setError("Failed to approve contractor.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleDelete = async (contractorId) => {
    if (
      window.confirm(
        "Are you sure you want to reject/delete this contractor request?",
      )
    ) {
      try {
        await AdminService.deleteContractor(contractorId);
        setSuccess("Contractor request rejected/deleted successfully!");
        fetchPendingContractors();
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        console.error("Error deleting contractor:", err);
        setError("Failed to delete contractor.");
        setTimeout(() => setError(""), 3000);
      }
    }
  };

  return (
    <Container className="mt-4">
      <Card className="pending-contractors-card">
        <Card.Header className="pending-contractors-header">
          <div className="d-flex align-items-center">
            <div className="pending-contractors-icon-wrapper me-2">
              <FaUserClock className="pending-contractors-icon" size={20} />
            </div>
            <h4 className="mb-0 fw-bold text-dark">Pending Approvals</h4>
          </div>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          {contractors.length === 0 ? (
            <div className="pending-contractors-empty-state">
              <FaUserClock
                size={40}
                className="pending-contractors-empty-icon"
              />
              <p>No pending contractor requests found.</p>
            </div>
          ) : (
            <Table hover responsive className="align-middle">
              <thead className="pending-contractors-table-thead">
                <tr>
                  <th className="pending-contractors-th ps-4">Username</th>
                  <th className="pending-contractors-th">Email</th>
                  <th className="pending-contractors-th">Area</th>
                  <th className="pending-contractors-th">Specialization</th>
                  <th className="pending-contractors-th text-end pe-4">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {contractors.map((contractor) => (
                  <tr key={contractor.id}>
                    <td className="ps-4 fw-medium text-dark">
                      {contractor.user.username}
                    </td>
                    <td className="text-muted">{contractor.user.email}</td>
                    <td>
                      <Badge bg="info" className="fw-normal px-2 py-1">
                        {contractor.assignedArea}
                      </Badge>
                    </td>
                    <td>
                      {contractor.specialization || (
                        <span className="text-muted fst-italic">N/A</span>
                      )}
                    </td>
                    <td className="text-end pe-4">
                      <Button
                        variant="success"
                        size="sm"
                        className="pending-contractors-btn-approve me-2"
                        onClick={() => handleApprove(contractor.id)}
                      >
                        <FaCheckCircle /> Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="pending-contractors-btn-reject"
                        onClick={() => handleDelete(contractor.id)}
                      >
                        <FaTrash /> Reject
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PendingContractors;
