import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const { currentUser, isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated && currentUser) {
    if (
      currentUser.role === "organizer" &&
      currentUser.organizerStatus === "pending_validation"
    ) {
      return <Navigate to="/organizer-pending-validation" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return children;
}
