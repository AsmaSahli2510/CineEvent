const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Movie is required'],
    },
    cinema: {
      type: String,
      required: [true, 'Cinema name is required'],
      trim: true,
    },
    hall: {
      type: String,
      required: [true, 'Hall is required'],
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String,
    },
    totalSeats: {
      type: Number,
      required: [true, 'Total seats is required'],
    },
    availableSeats: {
      type: Number,
    },
    price: {
      type: Number,
      required: [true, 'Ticket price is required'],
    },
    status: {
      type: String,
      enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
      default: 'scheduled',
    },
  },
  { timestamps: true }
);

eventSchema.pre('save', function (next) {
  if (this.isNew) {
    this.availableSeats = this.totalSeats;
  }
  next();
});

module.exports = mongoose.model('Event', eventSchema);
