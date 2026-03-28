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
router.post("/forgot-password", forgotPassword);
router.get("/reset-password/:token", validateResetToken);
router.post("/reset-password/:token", resetPassword);
router.get("/organizer-verify/:token", loginViaOrganizerApprovalLink);
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
