const Reservation = require('../models/Reservation');
const Event = require('../models/Event');
const { paginate, buildPaginationMeta } = require('../utils/helpers');

// @desc    Create a reservation
// @route   POST /api/reservations
// @access  Private
const createReservation = async (req, res) => {
  try {
    const { event: eventId, seats } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.availableSeats < seats) {
      return res.status(400).json({ message: 'Not enough available seats' });
    }

    const totalPrice = event.price * seats;

    const reservation = await Reservation.create({
      user: req.user._id,
      event: eventId,
      seats,
      totalPrice,
    });

    event.availableSeats -= seats;
    await event.save();

    res.status(201).json(reservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get current user's reservations
// @route   GET /api/reservations/my
// @access  Private
const getMyReservations = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { skip } = paginate(page, limit);

    const total = await Reservation.countDocuments({ user: req.user._id });
    const reservations = await Reservation.find({ user: req.user._id })
      .populate({ path: 'event', populate: { path: 'movie', select: 'title poster' } })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json({
      reservations,
      pagination: buildPaginationMeta(total, page, limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reservations (admin)
// @route   GET /api/reservations
// @access  Private/Admin
const getAllReservations = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const { skip } = paginate(page, limit);

    const filter = {};
    if (status) filter.status = status;

    const total = await Reservation.countDocuments(filter);
    const reservations = await Reservation.find(filter)
      .populate('user', 'name email')
      .populate({ path: 'event', populate: { path: 'movie', select: 'title' } })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json({
      reservations,
      pagination: buildPaginationMeta(total, page, limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel a reservation
// @route   PUT /api/reservations/:id/cancel
// @access  Private
const cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    if (reservation.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (reservation.status === 'cancelled') {
      return res.status(400).json({ message: 'Reservation already cancelled' });
    }

    reservation.status = 'cancelled';
    await reservation.save();

    const event = await Event.findById(reservation.event);
    if (event) {
      event.availableSeats += reservation.seats;
      await event.save();
    }

    res.json({ message: 'Reservation cancelled', reservation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReservation, getMyReservations, getAllReservations, cancelReservation };
