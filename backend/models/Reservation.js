const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event is required"],
    },
    selectedSeats: [
      {
        type: String,
        required: true,
      },
    ],
    bookingFee: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    // Total amount paid including booking fee
    paidAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
    bookingReference: {
      type: String,
      unique: true,
    },
    // Guest information (for non-authenticated users)
    guestInfo: {
      fullName: {
        type: String,
      },
      email: {
        type: String,
      },
      phoneNumber: {
        type: String,
      },
    },
    // Stripe payment information
    stripePaymentIntentId: {
      type: String,
    },
    paymentDetails: {
      stripeSessionId: String,
      last4Digits: String,
      paymentMethod: String,
    },
  },
  { timestamps: true },
);

reservationSchema.pre("save", function (next) {
  if (this.isNew && !this.bookingReference) {
    this.bookingReference =
      "CIN-" +
      Date.now() +
      "-" +
      Math.random().toString(36).substring(2, 7).toUpperCase();
  }
  next();
});

module.exports = mongoose.model("Reservation", reservationSchema);
