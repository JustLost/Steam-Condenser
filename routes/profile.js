const router = require("express").Router();

const mongoose = require("mongoose");

const Game = require("../models/Game.model");

const isLoggedIn = require("./../middleware/isLoggedIn");

const axios = require("axios");

// Require the User model in order to interact with the database
const User = require("../models/User.model");
const { array } = require("../config/cloudinary.config");

router.get("/profile", (req, res, next) => {
  const user = req.session.user;
  res.render("profile", { user });
});

router.get("/create-profile", async (req, res, next) => {
  const user = req.session.user;
  res.render("create-profile", { user });  
});

module.exports = router;
