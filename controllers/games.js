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
    const game = await Game.findById(req.params.gameId).populate("author");
    res.status(200).json(game);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
