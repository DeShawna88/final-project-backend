// models/hoot.js

const mongoose = require('mongoose');


const reviewSchema = new mongoose.Schema(
  {
    rating: { type: Number, min: 0, max: 10, required: true },
    comment: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const gameSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    img: { type: String, required: false },
    genres: {
      type: String,
      required: true,
      enum: ['Action', 'Adventure', 'Platform', 'Puzzle', 'Racing', 'Shooting', 'Simulation'],
    },
    releaseDate: { type: Date },
    developer: { type: String },
    publisher: { type: String },
    platforms: [{ type: String }],  // Array of supported platforms
    rating: { type: Number, min: 0, max: 10 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviews: [reviewSchema], // Array of reviews
  },
  { timestamps: true }
);



const Game = mongoose.model('Game', gameSchema);

module.exports = Game;