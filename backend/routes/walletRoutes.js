const express = require("express");
const walletController = require("../controllers/walletController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Protect all wallet routes
router.use(protect);

// Public routes - organizers can view their own wallet
router.get("/my", walletController.getMyOrganizerWallet);
router.get("/my/earnings", walletController.getMyEarnings);
router.get("/my/payouts", walletController.getMyPayoutHistory);

// Admin only routes
router.use(adminOnly);

// Get all organizers' wallet information
router.get("/organizers", walletController.getAllOrganizersWallet);

// Calculate revenue for an organizer
router.post("/calculate-revenue", walletController.calculateOrganizerRevenue);

// Get specific organizer wallet details
router.get("/:organizerId", walletController.getOrganizerWallet);

// Trigger payout for an organizer
router.post("/trigger-payout", walletController.triggerPayout);

// Get payout history for an organizer
router.get("/payouts/:organizerId", walletController.getPayoutHistory);

// Verify bank details
router.put("/:organizerId/verify-bank", walletController.verifyBankDetails);

module.exports = router;
