import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ContractorPrivateRoute = () => {
  const { currentUser } = useContext(AuthContext);

  // If not logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If logged in but not a contractor, redirect to home (or appropriate dashboard)
  // Check against the role stored in currentUser (assumes backend sends ROLE_CONTRACTOR or similar)
  const isContractor =
    currentUser.roles && currentUser.roles.includes("ROLE_CONTRACTOR");

  // Note: Adjust 'roles' check based on your actual auth response structure.
  // Often it might be currentUser.role === "ROLE_CONTRACTOR" if it's a single string.
  // Checking typical JWT response structure from AuthController...

  if (!isContractor && currentUser.role !== "ROLE_CONTRACTOR") {
    // Fallback if role is stored as string 'role' instead of array 'roles'
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ContractorPrivateRoute;
