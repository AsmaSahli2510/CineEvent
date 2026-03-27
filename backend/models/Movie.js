const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    genre: {
      type: [String],
      required: [true, 'Genre is required'],
    },
    director: {
      type: String,
      required: [true, 'Director is required'],
    },
    cast: {
      type: [String],
      default: [],
    },
    releaseDate: {
      type: Date,
      required: [true, 'Release date is required'],
    },
    duration: {
      type: Number,
      required: [true, 'Duration in minutes is required'],
    },
    poster: {
      type: String,
      default: '',
    },
    trailer: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    language: {
      type: String,
      default: 'French',
    },
    status: {
      type: String,
      enum: ['coming_soon', 'now_showing', 'archived'],
      default: 'coming_soon',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Movie', movieSchema);
