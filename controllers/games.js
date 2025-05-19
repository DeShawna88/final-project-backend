// controllers/games.js

const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const Game = require("../models/game.js");
const router = express.Router();


router.post('/', verifyToken, async (req, res) => {
    const authorId = req.user._id;
    console.log(req.body)
    try {
        // console.log(req.user._id);
        let authorPackage = req.body
        authorPackage.author = authorId
        const game = await Game.create(req.body);
        console.log(req.body);
        // game._doc.author = req.user;
        res.status(201).json(game);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});

module.exports = router;
