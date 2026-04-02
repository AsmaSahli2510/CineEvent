const express = require("express");
const router = express.Router();
const {
  register,
  registerOrganizer,
  login,
  googleAuth,
  forgotPassword,
  validateResetToken,
  resetPassword,
  getProfile,
  updateProfile,
  getAdminUsers,
  promoteUserToAdmin,
  updateUserRoleAdmin,
  toggleUserBlockAdmin,
  deleteUserAdmin,
  getPendingOrganizers,
  approveOrganizerAndSendEmail,
  rejectOrganizerAndSendEmail,
  loginViaOrganizerApprovalLink,
} = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { uploadLegalDocuments } = require("../middleware/uploadMiddleware");

router.post("/register", register);
router.post(
  "/register-organizer",
  uploadLegalDocuments.array("legalDocuments", 3),
  registerOrganizer,
);
router.post("/login", login);
router.post("/google", googleAuth);
router.post(" ", forgotPassword);
router.get("/reset-password/:token", validateResetToken);
router.post("/reset-password/:token", resetPassword);
router.get("/organizer-verify/:token", loginViaOrganizerApprovalLink);
router.get("/admin/users", protect, adminOnly, getAdminUsers);
router.post(
  "/admin/users/:userId/promote-admin",
  protect,
  adminOnly,
  promoteUserToAdmin,
);
router.patch(
  "/admin/users/:userId/role",
  protect,
  adminOnly,
  updateUserRoleAdmin,
);
router.patch(
  "/admin/users/:userId/block",
  protect,
  adminOnly,
  toggleUserBlockAdmin,
);
router.delete("/admin/users/:userId", protect, adminOnly, deleteUserAdmin);
router.get(
  "/admin/pending-organizers",
  protect,
  adminOnly,
  getPendingOrganizers,
);
router.post(
  "/admin/approve-organizer/:organizerId",
  protect,
  adminOnly,
  approveOrganizerAndSendEmail,
);
router.post(
  "/admin/reject-organizer/:organizerId",
  protect,
  adminOnly,
  rejectOrganizerAndSendEmail,
);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

module.exports = router;
