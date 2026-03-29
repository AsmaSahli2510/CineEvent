const mongoose = require("mongoose");

const seatRowSchema = new mongoose.Schema(
  {
    editorId: {
      type: String,
      default: "",
      trim: true,
    },
    label: {
      type: String,
      required: [true, "Row label is required"],
      trim: true,
    },
    seats: {
      type: Number,
      required: [true, "Seat count is required"],
      min: 1,
    },
    aisleEvery: {
      type: Number,
      default: 0,
      min: 0,
    },
    zoneId: {
      type: String,
      required: [true, "Zone is required"],
      trim: true,
    },
    wheelchair: {
      type: Number,
      default: 0,
      min: 0,
    },
    seatOverrides: {
      type: Map,
      of: String,
      default: {},
    },
  },
  { _id: false },
);

const structureSchema = new mongoose.Schema(
  {
    editorId: {
      type: String,
      default: "",
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Structure type is required"],
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Structure name is required"],
      trim: true,
    },
    side: {
      type: String,
      default: "center",
      trim: true,
    },
  },
  { _id: false },
);

const venueTemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Template name is required"],
      trim: true,
    },
    subtitle: {
      type: String,
      default: "",
      trim: true,
    },
    screenLabel: {
      type: String,
      default: "SCREEN",
      trim: true,
    },
    presetId: {
      type: String,
      default: "custom",
      trim: true,
    },
    ambience: {
      type: String,
      enum: ["dark", "sky", "festival"],
      default: "dark",
    },
    covered: {
      type: Boolean,
      default: true,
    },
    rows: {
      type: [seatRowSchema],
      default: [],
    },
    structures: {
      type: [structureSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    stats: {
      capacity: {
        type: Number,
        default: 0,
      },
      rows: {
        type: Number,
        default: 0,
      },
      wheelchair: {
        type: Number,
        default: 0,
      },
      zones: {
        type: Map,
        of: Number,
        default: {},
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("VenueTemplate", venueTemplateSchema);
