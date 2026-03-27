import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./components/MainLayout";
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
          element={<OrganizerRegistrationPage />}
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
      <Route path="/signup" element={<SpectatorRegistrationPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route
        path="/events/:eventId/reserve"
        element={<GuestReservationPage />}
      />
      <Route
        path="/admin/create-room-template-preview"
        element={<CreateRoomTemplatePage />}
      />
      <Route path="/admin/donations-preview" element={<DonationsPage />} />
      <Route
        path="/admin/venue-template-management-preview"
        element={<VenueTemplateManagementPage />}
      />
      <Route
        path="/admin/user-management-preview"
        element={<UserManagementPage />}
      />
      <Route
        path="/admin/comment-moderation-preview"
        element={<CommentModerationPage />}
      />
      <Route
        path="/admin/organizer-wallet-preview"
        element={<OrganizerWalletPage />}
      />
      <Route path="/admin/revenue-preview" element={<RevenuePage />} />
      <Route path="/admin/statistics-preview" element={<StatisticsPage />} />
      <Route
        path="/admin/event-validation-preview"
        element={<EventValidationPage />}
      />
      <Route
        path="/admin/organizer-validation-preview"
        element={<OrganizerValidationPage />}
      />
      <Route path="/admin/dashboard-preview" element={<AdminDashboardPage />} />
    </Routes>
  );
}
