const express = require("express");
const router = express.Router();
const {
  createReservation,
  getMyReservations,
  getAllReservations,
  cancelReservation,
  createPaymentIntent,
  confirmGuestReservation,
} = require("../controllers/reservationController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Authenticated routes
router.post("/", protect, createReservation);
router.get("/my", protect, getMyReservations);
router.get("/", protect, adminOnly, getAllReservations);
router.put("/:id/cancel", protect, cancelReservation);

// Guest reservation routes (public)
router.post("/payment/intent", createPaymentIntent);
router.post("/guest/confirm", confirmGuestReservation);

module.exports = router;
