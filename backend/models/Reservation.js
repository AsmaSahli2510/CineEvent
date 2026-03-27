const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event is required'],
    },
    seats: {
      type: Number,
      required: [true, 'Number of seats is required'],
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded'],
      default: 'unpaid',
    },
    bookingReference: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

reservationSchema.pre('save', function (next) {
  if (this.isNew && !this.bookingReference) {
    this.bookingReference =
      'CIN-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Reservation', reservationSchema);
