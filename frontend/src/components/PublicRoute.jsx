import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const { currentUser, isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated && currentUser) {
    return <Navigate to="/" replace />;
  }

  return children;
}
