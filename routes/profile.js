const router = require("express").Router();

const mongoose = require("mongoose");

const Game = require("../models/Game.model");

const isLoggedIn = require("./../middleware/isLoggedIn");

const axios = require("axios");

const fileUploader = require("../config/cloudinary.config");
// Require the User model in order to interact with the database
const User = require("../models/User.model");
const { array } = require("../config/cloudinary.config");
const { route } = require(".");

router.get("/profile", (req, res, next) => {
  const user = req.session.user;
  res.render("profile", { user });
});

router.get("/create-profile", async (req, res, next) => {
  const user = req.session.user;
  res.render("create-profile", { user });  
});

//Edit profile
router.get("/profile/edit/:id", (req, res, next) => {
  User.findById(req.params.id)
    .then((profile) => {
      res.render("profile-edit", profile);
    })
    .catch((err) => next(err));
});

router.post(
  "/profile/edit/:id",
  fileUploader.single("image"),
  (req, res, next) => {
    const { id } = req.params;
    const { user, email, existingImage, gameTags } = req.body;

    console.log("user:", user);

    let imageUrl;
    let username = user;

    if (req.file) {
      imageUrl = req.file.path;
    } else {
      imageUrl = existingImage;
    }
    
    User.findByIdAndUpdate(id, { username, email, imageUrl, gameTags })
      .then((user) => {
        req.session.user = user;
        res.redirect(`/profile/${user._id}/recommended`);
      })
      .catch((err) => next(err));
  }
);

//end

router.get("/profile/:id/recommended",(req, res, next) => {
  const {id} = req.params
  
  User.findOneAndUpdate(id)
  .then((foundUser) => {
    foundUser.gameTags.forEach(tag => {
      Game.find()
    })
    
  })
  
}); 


module.exports = router;