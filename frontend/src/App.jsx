import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import EventDetailsPage from "./pages/public-pages/EventDetailsPage";
import EventsPage from "./pages/public-pages/EventsPage";
import ForgotPasswordPage from "./pages/public-pages/ForgotPasswordPage";
import GuestReservationPage from "./pages/public-pages/GuestReservationPage";
import HomePage from "./pages/public-pages/HomePage";
import LoginPage from "./pages/public-pages/LoginPage";
import NotFoundPage from "./pages/public-pages/NotFoundPage";
import OrganizerRegistrationPage from "./pages/public-pages/OrganizerRegistrationPage";
import ProfilePage from "./pages/public-pages/ProfilePage";
import ResetPasswordPage from "./pages/public-pages/ResetPasswordPage";
import SpectatorRegistrationPage from "./pages/public-pages/SpectatorRegistrationPage";
import OrganizerPendingValidationPage from "./pages/public-pages/OrganizerPendingValidationPage";
import OrganizerVerifyPage from "./pages/public-pages/OrganizerVerifyPage";
import CreateRoomTemplatePage from "./pages/admin-pages/CreateRoomTemplatePage";
import DonationsPage from "./pages/admin-pages/DonationsPage";
import VenueTemplateManagementPage from "./pages/admin-pages/VenueTemplateManagementPage";
import UserManagementPage from "./pages/admin-pages/UserManagementPage";
import CommentModerationPage from "./pages/admin-pages/CommentModerationPage";
import OrganizerWalletPage from "./pages/admin-pages/OrganizerWalletPage";
import RevenuePage from "./pages/admin-pages/RevenuePage";
import StatisticsPage from "./pages/admin-pages/StatisticsPage";
import EventValidationPage from "./pages/admin-pages/EventValidationPage";
import OrganizerValidationPage from "./pages/admin-pages/OrganizerValidationPage";
import AdminDashboardPage from "./pages/admin-pages/AdminDashboardPage";
import OrganizerDashboardPage from "./pages/organizer-pages/OrganizerDashboardPage";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <EventsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/:eventId"
          element={
            <ProtectedRoute>
              <EventDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer-registration"
          element={
            <PublicRoute>
              <OrganizerRegistrationPage />
            </PublicRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SpectatorRegistrationPage />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/organizer-pending-validation"
        element={<OrganizerPendingValidationPage />}
      />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route
        path="/organizer-verify/:token"
        element={<OrganizerVerifyPage />}
      />
      <Route
        path="/events/:eventId/reserve"
        element={<GuestReservationPage />}
      />
      <Route
        path="/organizer-dashboard"
        element={
          <ProtectedRoute requiredRole="organizer">
            <OrganizerDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <Navigate to="/admin/dashboard" replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/events/validation"
        element={
          <ProtectedRoute requiredRole="admin">
            <EventValidationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/comments/moderation"
        element={
          <ProtectedRoute requiredRole="admin">
            <CommentModerationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/organizers/validation"
        element={
          <ProtectedRoute requiredRole="admin">
            <OrganizerValidationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute requiredRole="admin">
            <UserManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/revenue"
        element={
          <ProtectedRoute requiredRole="admin">
            <RevenuePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/donations"
        element={
          <ProtectedRoute requiredRole="admin">
            <DonationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/organizers/wallet"
        element={
          <ProtectedRoute requiredRole="admin">
            <OrganizerWalletPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/statistics"
        element={
          <ProtectedRoute requiredRole="admin">
            <StatisticsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/venues/templates"
        element={
          <ProtectedRoute requiredRole="admin">
            <VenueTemplateManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/rooms/templates"
        element={
          <ProtectedRoute requiredRole="admin">
            <CreateRoomTemplatePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
