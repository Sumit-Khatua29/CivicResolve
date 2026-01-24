import React from "react";
import { Nav } from "react-bootstrap";
import { motion } from "framer-motion";
import {
  FaChartPie,
  FaList,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaUserClock,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import "./AdminSidebar.css";

const AdminSidebar = ({ onLogout, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  const menuItems = [
    {
      id: "issues",
      label: "Issue Management",
      icon: <FaList />,
      path: "/admin/issues",
    },
    {
      id: "approvals",
      label: "Approvals",
      icon: <FaUserClock />,
      path: "/admin/approvals",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: <FaChartPie />,
      path: "/admin/analytics",
    },
    {
      id: "users",
      label: "User Management",
      icon: <FaUsers />,
      path: "/admin/users",
    },
    {
      id: "settings",
      label: "Settings",
      icon: <FaCog />,
      path: "/admin/settings",
    },
  ];

  // Helper to check active state
  const isPathActive = (path) => {
    if (
      path === "/admin/issues" &&
      (location.pathname === "/admin" || location.pathname === "/admin/issues")
    ) {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <div className="d-flex flex-column h-100 p-3 glass-card border-0 admin-sidebar-container">
      <div className="mb-5 px-2">
        <h4 className="fw-bold text-primary m-0">AdminPanel</h4>
        <small className="text-muted">CivicResolve Manager</small>
      </div>

      <Nav className="flex-column flex-grow-1 gap-2">
        {menuItems.map((item) => {
          const isActive = isPathActive(item.path);
          return (
            <Nav.Link
              key={item.id}
              as="div"
              onClick={() => handleNavigation(item.path)}
              className="p-0 border-0 admin-sidebar-link"
            >
              <motion.div
                className={`d-flex align-items-center px-3 py-3 rounded-3 ${isActive ? "bg-primary text-white shadow" : "text-secondary"}`}
                whileHover={{
                  x: 5,
                  backgroundColor: isActive
                    ? undefined
                    : "rgba(67, 97, 238, 0.1)",
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="me-3 fs-5">{item.icon}</span>
                <span className="fw-medium">{item.label}</span>
              </motion.div>
            </Nav.Link>
          );
        })}
      </Nav>

      <div className="mt-auto">
        <motion.div
          className="d-flex align-items-center px-3 py-3 rounded-3 text-danger admin-sidebar-logout"
          whileHover={{ x: 5, backgroundColor: "rgba(231, 76, 60, 0.1)" }}
          onClick={() => {
            onLogout();
            if (onClose) onClose();
          }}
        >
          <span className="me-3 fs-5">
            <FaSignOutAlt />
          </span>
          <span className="fw-medium">Logout</span>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminSidebar;
