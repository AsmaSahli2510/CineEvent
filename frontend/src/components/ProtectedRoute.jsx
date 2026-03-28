import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
  requiredRole,
  allowPendingOrganizer = false,
}) {
  const { currentUser, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (
    currentUser.role === "organizer" &&
    currentUser.organizerStatus === "pending_validation" &&
    !allowPendingOrganizer
  ) {
    return <Navigate to="/organizer-pending-validation" replace />;
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
