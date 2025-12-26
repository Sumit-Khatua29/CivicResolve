import React, { useState, useEffect } from "react";
import { Container, Table, Button, Badge, Alert } from "react-bootstrap";
import axios from "axios";
import { motion } from "framer-motion";
import { FaUserCheck, FaUserSlash, FaUserCog } from "react-icons/fa";
import "./UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await axios.get("http://localhost:8080/api/users", {
        headers: { Authorization: "Bearer " + user.token },
      });
      setUsers(response.data);
    } catch (error) {
      setError("Failed to fetch users.");
      console.error("Error fetching users", error);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
      try {
          const user = JSON.parse(localStorage.getItem("user"));
          const endpoint = currentStatus 
            ? `http://localhost:8080/api/users/${userId}/block` 
            : `http://localhost:8080/api/users/${userId}/enable`;
            
          await axios.put(endpoint, {}, {
            headers: { Authorization: "Bearer " + user.token },
          });
          
          fetchUsers();
      } catch (error) {
          setError("Failed to update user status.");
      }
  }

  return (
    <div className="glass-card">
      <div className="d-flex align-items-center mb-4">
          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center p-3 me-3 user-mgmt-header-icon">
              <FaUserCog size={24} />
          </div>
          <div>
            <h4 className="mb-0 fw-bold">User Management</h4>
            <small className="text-muted">Manage system access and permissions</small>
          </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      
      <div className="table-responsive">
        <Table className="table-premium align-middle">
            <thead className="bg-light">
            <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {users.map((u, index) => (
                <motion.tr 
                    key={u.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                >
                <td className="fw-bold text-secondary">#{u.id}</td>
                <td className="fw-medium">{u.username}</td>
                <td className="text-muted">{u.email}</td>
                <td>
                    <Badge bg="light" text="dark" className="border fw-normal">
                        {u.role.replace('ROLE_', '')}
                    </Badge>
                </td>
                <td>
                    <Badge bg={u.enabled ? "success" : "danger"} className="badge-custom">
                    {u.enabled ? "Active" : "Blocked"}
                    </Badge>
                </td>
                <td>
                    {u.role !== 'ROLE_ADMIN' && (
                        <Button 
                            variant={u.enabled ? "outline-danger" : "outline-success"}
                            size="sm"
                            className="d-flex align-items-center rounded-pill px-3"
                            onClick={() => toggleUserStatus(u.id, u.enabled)}
                        >
                            {u.enabled ? <><FaUserSlash className="me-2"/> Block</> : <><FaUserCheck className="me-2"/> Unblock</>}
                        </Button>
                    )}
                </td>
                </motion.tr>
            ))}
            </tbody>
        </Table>
      </div>
    </div>
  );
};

export default UserManagement;
