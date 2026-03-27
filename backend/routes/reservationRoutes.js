const express = require('express');
const router = express.Router();
const {
  createReservation,
  getMyReservations,
  getAllReservations,
  cancelReservation,
} = require('../controllers/reservationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, createReservation);
router.get('/my', protect, getMyReservations);
router.get('/', protect, adminOnly, getAllReservations);
router.put('/:id/cancel', protect, cancelReservation);

module.exports = router;
