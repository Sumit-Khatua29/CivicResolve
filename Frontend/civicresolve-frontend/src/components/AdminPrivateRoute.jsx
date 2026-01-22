import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminPrivateRoute = () => {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return <Navigate to="/admin-login" />;
  }

  // Optional: Check for role 'ROLE_ADMIN' and redirect if not authorized
  if (currentUser.role !== 'ROLE_ADMIN') {
      return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default AdminPrivateRoute;
