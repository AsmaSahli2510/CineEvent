const Reservation = require("../models/Reservation");
const Event = require("../models/Event");
const { paginate, buildPaginationMeta } = require("../utils/helpers");
const { sendTicketEmail } = require("../utils/email");

// Lazy-load Stripe to avoid errors if API key is not set
const getStripeClient = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY environment variable is not set");
  }
  return require("stripe")(process.env.STRIPE_SECRET_KEY);
};

// @desc    Create a reservation
// @route   POST /api/reservations
// @access  Private
const createReservation = async (req, res) => {
  try {
    const { event: eventId, seats } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.availableSeats < seats) {
      return res.status(400).json({ message: "Not enough available seats" });
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

    // Fetch both authenticated user reservations AND guest reservations with matching email
    const query = {
      $or: [
        { user: req.user._id }, // Authenticated user reservations
        { "guestInfo.email": req.user.email }, // Guest reservations with matching email
      ],
    };

    const total = await Reservation.countDocuments(query);
    const reservations = await Reservation.find(query)
      .populate({
        path: "event",
        populate: { path: "movie", select: "title poster" },
      })
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
      .populate("user", "name email")
      .populate({ path: "event", populate: { path: "movie", select: "title" } })
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
      return res.status(404).json({ message: "Reservation not found" });
    }

    if (
      reservation.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (reservation.status === "cancelled") {
      return res.status(400).json({ message: "Reservation already cancelled" });
    }

    reservation.status = "cancelled";
    await reservation.save();

    const event = await Event.findById(reservation.event);
    if (event) {
      event.availableSeats += reservation.seats;
      await event.save();
    }

    res.json({ message: "Reservation cancelled", reservation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reservations for organizer's events
// @route   GET /api/reservations/organizer/events
// @access  Private
const getOrganizerReservations = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const { skip } = paginate(page, limit);

    // Get all events organized by the current user
    const organizerEvents = await Event.find({
      organizer: req.user._id,
    }).select("_id");
    const eventIds = organizerEvents.map((event) => event._id);

    if (eventIds.length === 0) {
      return res.json({
        reservations: [],
        pagination: buildPaginationMeta(0, page, limit),
      });
    }

    // Build filter for reservations
    const filter = { event: { $in: eventIds } };
    if (status) filter.status = status;

    const total = await Reservation.countDocuments(filter);
    const reservations = await Reservation.find(filter)
      .populate("user", "name email")
      .populate({
        path: "event",
        populate: { path: "movie", select: "title poster" },
      })
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

module.exports = {
  createReservation,
  getMyReservations,
  getAllReservations,
  cancelReservation,
  getOrganizerReservations,
  createPaymentIntent,
  confirmGuestReservation,
};

// @desc    Create a payment intent for guest checkout
// @route   POST /api/reservations/payment/intent
// @access  Public
async function createPaymentIntent(req, res) {
  try {
    const { eventId, selectedSeats, totalAmount, guestInfo } = req.body;

    // Validate event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Validate guest info
    if (!guestInfo?.fullName || !guestInfo?.email) {
      return res.status(400).json({ message: "Guest information is required" });
    }

    // Validate seats
    if (!selectedSeats || selectedSeats.length === 0) {
      return res.status(400).json({ message: "No seats selected" });
    }

    // Get Stripe client
    const stripe = getStripeClient();

    // Create Stripe payment intent
    // Note: Stripe does not support TND, so we charge in USD with the same numeric value
    // Example: 16 TND displayed to user = 16 USD charged to Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents (e.g., 16 USD = 1600 cents)
      currency: "usd", // Stripe uses USD; frontend displays prices in TND
      description: `CineEvent reservation for ${event.title || "event"}`,
      metadata: {
        eventId: eventId.toString(),
        guestEmail: guestInfo.email,
        guestName: guestInfo.fullName,
        selectedSeats: JSON.stringify(selectedSeats),
        originalCurrency: "TND", // Track original currency in metadata
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Payment intent error:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to create payment intent" });
  }
}

// @desc    Confirm guest reservation after successful payment
// @route   POST /api/reservations/guest/confirm
// @access  Public
async function confirmGuestReservation(req, res) {
  try {
    const {
      eventId,
      selectedSeats,
      totalPrice,
      paidAmount,
      bookingFee,
      guestInfo,
      stripePaymentIntentId,
      paymentDetails,
    } = req.body;

    // Validate required fields
    if (
      !eventId ||
      !selectedSeats ||
      !guestInfo?.email ||
      !stripePaymentIntentId
    ) {
      return res
        .status(400)
        .json({ message: "Missing required reservation information" });
    }

    // Get Stripe client
    const stripe = getStripeClient();

    // Verify payment intent exists and is successful
    const paymentIntent = await stripe.paymentIntents.retrieve(
      stripePaymentIntentId,
    );
    if (!paymentIntent) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ message: "Payment was not successful" });
    }

    // Get event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check seat availability
    if (event.availableSeats < selectedSeats.length) {
      return res.status(400).json({ message: "Not enough available seats" });
    }

    // Create reservation
    const reservation = await Reservation.create({
      event: eventId,
      selectedSeats,
      totalPrice,
      paidAmount: paidAmount || totalPrice + bookingFee, // Total amount paid including booking fee
      bookingFee,
      guestInfo: {
        fullName: guestInfo.fullName,
        email: guestInfo.email,
        phoneNumber: guestInfo.phoneNumber || "",
      },
      stripePaymentIntentId,
      paymentDetails,
      paymentStatus: "paid",
      status: "confirmed",
    });

    // Update event available seats
    event.availableSeats -= selectedSeats.length;
    await event.save();

    // Send confirmation email to guest
    const eventTitle =
      event.eventType === "movie"
        ? event.movieDetails.title
        : event.festivalDetails.festivalName;

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const bookingLink = `${frontendUrl}/booking/${reservation._id}`;

    try {
      await sendTicketEmail({
        to: reservation.guestInfo.email,
        guestName: reservation.guestInfo.fullName,
        eventTitle: eventTitle,
        eventDate: event.date,
        bookingReference: reservation.bookingReference,
        selectedSeats: reservation.selectedSeats,
        totalAmount: reservation.paidAmount,
        bookingLink: bookingLink,
      });
    } catch (emailError) {
      console.error("Failed to send ticket email:", emailError);
      // Continue with response even if email fails
    }

    res.status(201).json({
      message: "Reservation confirmed",
      reservation: {
        id: reservation._id,
        bookingReference: reservation.bookingReference,
        email: reservation.guestInfo.email,
        totalPrice: reservation.totalPrice,
        paidAmount: reservation.paidAmount,
        bookingFee: reservation.bookingFee,
        selectedSeats: reservation.selectedSeats,
      },
    });
  } catch (error) {
    console.error("Reservation confirmation error:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to confirm reservation" });
  }
}
