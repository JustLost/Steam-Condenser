const router = require("express").Router();

const mongoose = require("mongoose");

const Game = require("../models/Game.model");

// Require the User model in order to interact with the database
const User = require("../models/User.model");

router.get("/profile", (req, res, next) => {
  res.render("profile");
});

router.get("/create-profile", (req, res, next) => {
  res.render("create-profile");
});

module.exports = router;
