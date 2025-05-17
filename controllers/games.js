// controllers/games.js

const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const Game = require("../models/game.js");
const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
    try {
        const gameData = { ...req.body, author: req.user._id };
        if (!req.body.title || !req.body.genre) {
            return res.status(400).json({ err: "Title and genre are required." });
        }
        const game = await Game.create(gameData);
        const response = { ...game.toObject(), author: req.user };
        res.status(201).json(response);
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({ err: "Invalid data format." });
        }
        res.status(500).json({ err: "Internal Server Error" });
    }
});

module.exports = router;
