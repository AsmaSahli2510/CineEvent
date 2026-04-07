const mongoose = require("mongoose");
const { Schema } = mongoose;

const eventSchema = new mongoose.Schema(
  {
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    submittedByName: {
      type: String,
      trim: true,
      default: "",
    },
    organizationName: {
      type: String,
      trim: true,
      default: "",
    },
    eventType: {
      type: String,
      enum: ["movie", "festival"],
      required: [true, "Event type is required"],
      default: "movie",
    },

    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
    },

    movieDetails: {
      title: { type: String, trim: true, default: "" },
      genre: { type: String, trim: true, default: "" },
      durationMinutes: { type: Number, default: 0 },
      synopsis: { type: String, default: "" },
      director: { type: String, trim: true, default: "" },
      posterFileName: { type: String, trim: true, default: "" },
      posterUrl: { type: String, default: "" },
      posterDataUrl: { type: String, default: "" },
    },

    festivalDetails: {
      festivalName: { type: String, trim: true, default: "" },
      category: { type: String, trim: true, default: "" },
      description: { type: String, default: "" },
      festivalStartDate: { type: Date },
      festivalEndDate: { type: Date },
      program: [
        {
          title: { type: String, trim: true, default: "" },
          description: { type: String, default: "" },
          startTime: { type: String, default: "" },
          duration: { type: Number, default: 0 },
        },
      ],
      posterFileName: { type: String, trim: true, default: "" },
      posterUrl: { type: String, default: "" },
      posterDataUrl: { type: String, default: "" },
    },

    cinema: {
      type: String,
      required: [true, "Cinema name is required"],
      trim: true,
    },

    hall: {
      type: String,
      required: [true, "Hall is required"],
    },

    date: {
      type: Date,
      required: [true, "Event date is required"],
    },

    startTime: {
      type: String,
      required: [true, "Start time is required"],
    },

    endTime: {
      type: String,
    },

    totalSeats: {
      type: Number,
      required: [true, "Total seats is required"],
    },

    availableSeats: {
      type: Number,
    },

    price: {
      type: Number,
      required: [true, "Ticket price is required"],
    },

    status: {
      type: String,
      enum: [
        "pending_validation",
        "scheduled",
        "ongoing",
        "completed",
        "cancelled",
        "published",
        "rejected",
      ],
      default: "scheduled",
    },

    venueDetails: {
      venueTemplateId: { type: String, default: "" },
      venueTemplateName: { type: String, default: "" },
      location: { type: String, default: "" },
      venueType: { type: String, default: "" },
    },

    venueSnapshot: {
      screenLabel: { type: String, default: "SCREEN" },
      rows: [Schema.Types.Mixed],
    },

    pricingDetails: {
      currency: { type: String, default: "TND" },
      isFreeEvent: { type: Boolean, default: false },
      pricingMode: { type: String, default: "unique" },
      singlePrice: { type: Number, default: 0 },
      categories: {
        type: Map,
        of: Number,
        default: {},
      },
      serviceFeeRate: { type: Number, default: 0 },
      serviceFee: { type: Number, default: 0 },
      spectatorTotal: { type: Number, default: 0 },
    },

    charity: {
      isCharityEvent: { type: Boolean, default: false },
      beneficiaryAssociation: { type: String, default: "" },
      minimumDonationSuggestion: { type: Number, default: 0 },
    },

    media: {
      teaserUrl: { type: String, default: "" },
      galleryImageFileNames: [{ type: String }],
      galleryImageUrls: [{ type: String }],
    },
  },
  {
    timestamps: true,
    toJSON: { flattenMaps: true },
    toObject: { flattenMaps: true },
  },
);

eventSchema.pre("save", function (next) {
  if (this.isNew) {
    this.availableSeats = this.totalSeats;
  }
  next();
});

module.exports = mongoose.model("Event", eventSchema);