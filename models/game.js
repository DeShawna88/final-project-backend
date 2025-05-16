// models/hoot.js

const mongoose = require('mongoose');


const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

const gameSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    genres: {
      type: String,
      required: true,
      enum: ['Action', 'Adventure', 'Puzzle', 'Racing', 'Shooting', 'Simulation'],
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comments: [commentSchema], // add here
  },
  { timestamps: true }
);



const Game = mongoose.model('Game', gameSchema);

module.exports = Game;