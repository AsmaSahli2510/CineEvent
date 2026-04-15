const mongoose = require("mongoose");

const payoutSchema = new mongoose.Schema(
  {
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    adminCommission: {
      type: Number,
      required: true,
    },
    organizerAmount: {
      type: Number,
      required: true,
    },
    commissionRate: {
      type: Number,
      default: 10, // 10% commission
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    payoutMethod: {
      type: String,
      enum: ["bank_transfer", "check", "other"],
      default: "bank_transfer",
    },
    bankAccountDetails: {
      iban: String,
      accountHolder: String,
    },
    transactionReference: {
      type: String,
      unique: true,
      sparse: true,
    },
    notes: String,
    failureReason: String,
    processedAt: {
      type: Date,
      default: null,
    },
    reservations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reservation",
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Payout", payoutSchema);
