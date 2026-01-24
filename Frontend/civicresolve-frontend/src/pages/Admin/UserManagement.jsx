import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Badge,
  Alert,
  Tabs,
  Tab,
} from "react-bootstrap";
import api from "../../services/api";
import { motion } from "framer-motion";
import { FaUserCheck, FaUserSlash, FaUserCog, FaTrash } from "react-icons/fa";
import "./UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [key, setKey] = useState("citizens"); // Default active tab

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (error) {
      setError("Failed to fetch users.");
      console.error("Error fetching users", error);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const endpoint = currentStatus
        ? `/users/${userId}/block`
        : `/users/${userId}/enable`;

      await api.put(endpoint);

      fetchUsers();
    } catch (error) {
      setError("Failed to update user status.");
    }
  };

  const deleteUser = async (userId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone.",
      )
    ) {
      try {
        await api.delete(`/users/${userId}`);
        // Remove user from local state immediately for better UX
        setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));
      } catch (error) {
        console.error("Error deleting user:", error);
        setError("Failed to delete user. Please try again.");
      }
    }
  };

  const renderUserTable = (filteredUsers, showActions = true) => (
    <div className="table-responsive">
      <Table className="table-premium align-middle">
        <thead className="bg-light">
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            {showActions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((u, index) => (
              <motion.tr
                key={u.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <td className="fw-bold text-secondary">#{index + 1}</td>
                <td className="fw-medium">{u.username}</td>
                <td className="text-muted">{u.email}</td>
                <td>
                  <Badge bg="light" text="dark" className="border fw-normal">
                    {u.role.replace("ROLE_", "")}
                  </Badge>
                </td>
                <td>
                  <Badge
                    bg={u.enabled ? "success" : "danger"}
                    className="badge-custom"
                  >
                    {u.enabled ? "Active" : "Blocked"}
                  </Badge>
                </td>
                {showActions && (
                  <td>
                    {u.role !== "ROLE_ADMIN" && (
                      <div className="d-flex align-items-center">
                        <Button
                          variant={
                            u.enabled ? "outline-danger" : "outline-success"
                          }
                          size="sm"
                          className="d-flex align-items-center rounded-pill px-3 me-2"
                          onClick={() => toggleUserStatus(u.id, u.enabled)}
                        >
                          {u.enabled ? (
                            <>
                              <FaUserSlash className="me-2" /> Block
                            </>
                          ) : (
                            <>
                              <FaUserCheck className="me-2" /> Unblock
                            </>
                          )}
                        </Button>
                        {u.role === "ROLE_CONTRACTOR" && (
                          <Button
                            variant="danger"
                            size="sm"
                            className="d-flex align-items-center rounded-pill px-3"
                            onClick={() => deleteUser(u.id)}
                          >
                            <FaTrash className="me-2" /> Delete
                          </Button>
                        )}
                      </div>
                    )}
                  </td>
                )}
              </motion.tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={showActions ? 6 : 5}
                className="text-center py-4 text-muted"
              >
                No users found in this category.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );

  const citizens = users.filter((u) => u.role === "ROLE_CITIZEN");
  const contractors = users.filter((u) => u.role === "ROLE_CONTRACTOR");
  const admins = users.filter((u) => u.role === "ROLE_ADMIN");

  return (
    <div className="glass-card">
      <div className="d-flex align-items-center mb-4">
        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center p-3 me-3 user-mgmt-header-icon">
          <FaUserCog size={24} />
        </div>
        <div>
          <h4 className="mb-0 fw-bold">User Management</h4>
          <small className="text-muted">
            Manage system access and permissions
          </small>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Tabs
        id="user-role-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3 custom-tabs"
        fill
      >
        <Tab eventKey="admins" title={`Admins (${admins.length})`}>
          {renderUserTable(admins, false)}
        </Tab>
        <Tab
          eventKey="contractors"
          title={`Contractors (${contractors.length})`}
        >
          {renderUserTable(contractors)}
        </Tab>
        <Tab eventKey="citizens" title={`Citizens (${citizens.length})`}>
          {renderUserTable(citizens)}
        </Tab>
      </Tabs>
    </div>
  );
};

export default UserManagement;
