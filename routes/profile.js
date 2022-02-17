const router = require("express").Router();

const mongoose = require("mongoose");

// Require the User model in order to interact with the database
const User = require("../models/User.model");

router.get("/profile", (req, res, next) => {
  res.render("profile");
});

module.exports = router;
