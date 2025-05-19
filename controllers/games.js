// controllers/games.js

const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const Game = require("../models/game.js");
const router = express.Router();


router.post('/', verifyToken, async (req, res) => {
    const authorId = req.user._id;
    try {
        let authorPackage = req.body
        authorPackage.author = authorId
        const game = await Game.create(req.body);
        console.log(req.body);
        game._doc.author = req.user;
        res.status(201).json(game);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    const games = await Game.find({})
      .populate("author")
      .sort({ createdAt: "desc" });
    res.status(200).json(games);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.get("/:gameId", verifyToken, async (req, res) => {
  try {
    const game = await Game.findById(req.params.gameId).populate([
      'author',
      'reviews.author',
    ]);
    res.status(200).json(game);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.put("/:gameId", verifyToken, async (req, res) => {
  try {
    // Find the gamr:
    const game = await Game.findById(req.params.gameId);
    // Check permissions:
    if (!game.author.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!");
    }
    // Update game:
    const updatedGame = await Game.findByIdAndUpdate(
      req.params.gameId,
      req.body,
      { new: true }
    );
    // Append req.user to the author property:
    updatedGame._doc.author = req.user;
    // Issue JSON response:
    res.status(200).json(updatedGame);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.delete("/:gameId", verifyToken, async (req, res) => {
  try {
    const game = await Game.findById(req.params.gameId);

    if (!game.author.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!");
    }
    const deletedGame = await Game.findByIdAndDelete(req.params.gameId);
    res.status(200).json(deletedGame);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.post("/:gameId/reviews", verifyToken, async (req, res) => {
  try {
    req.body.author = req.user._id;
    const game = await Game.findById(req.params.gameId);
    game.reviews.push(req.body);
    await game.save();
    // Find the newly created review:
    const newReview = game.reviews[game.reviews.length - 1];
    newReview._doc.author = req.user;
    // Respond with the newReview:
    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.put("/:gameId/reviews/:reviewId", verifyToken, async (req, res) => {
  try {
    const game = await Game.findById(req.params.gameId);
    const review = game.reviews.id(req.params.reviewId);
    // ensures the current user is the author of the review
    if (review.author.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to edit this review" });
    }

    review.comment = req.body.comment;
    await game.save();
    res.status(200).json({ message: "Review updated successfully" });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.delete("/:gameId/reviews/:reviewId", verifyToken, async (req, res) => {
  try {
    const game = await Game.findById(req.params.gameId);
    const review = game.reviews.id(req.params.reviewId);
    if (review.author.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to edit this review" });
    }

    game.reviews.remove({ _id: req.params.reviewId });
    await game.save();
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
