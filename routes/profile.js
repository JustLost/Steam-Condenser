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
router.get("/profile/edit", (req, res, next) => {
  const user = req.session.user;
  res.render("profile-edit", { user });


  /* User.findById(req.params.id)
    .then((profile) => {
      res.render("profile-edit", profile);
    })
    .catch((err) => next(err));  */
});


router.post(
  "/profile/edit",
  fileUploader.single("image"),
  (req, res, next) => {
    const user = req.session.user;
    /* const { id } = req.params; */
    const { username, email, existingImage, gameTags } = req.body;

    /* console.log("user:", user); */

    let imageUrl;
    /* let username = user; */

    if (req.file) {
      imageUrl = req.file.path;
    } else {
      imageUrl = existingImage;
    }
    
    User.findByIdAndUpdate(user._id, { username, email, imageUrl, gameTags })
      .then((user) => {
        req.session.user = user;
        res.redirect(`/profile/${user._id}/recommended`);
      })
      .catch((err) => next(err));
  }
);

//end

// router.get("/profile/:id/recommended",(req, res, next) => {
//   const {id} = req.params
//   // Game.find({genres:{$elemMatch: {$or:[{description:'Adventure'}, {description:'Indie'}]}}})
//   // .then((gameList) => {
//   //   console.log(gameList)
//   // })

//   let query = ""
//   User.findById(id)
//   .then((foundUser) => {
//     foundUser.gameTags.forEach((tag, i) => {
//       if(i == 0){
//         query = `{ description: "${tag}" }`;
//       } else {
//         query = query + `,{description:"${tag}"}`;
//       }          
//     })
//     return query;
//   })
//   .then((query) => {
//     console.log(typeof(query))
//     const fullQuery = {genres:{$elemMatch: {$or:[query]}}}
//     console.log(fullQuery)
//     return Game.find(fullQuery)
//   })
//   .then((gameList) => {
//     console.log(gameList)
//   })
// }); 

router.get("/profile/:id/recommended",(req, res, next) => {
  const {id} = req.params
  
  User.findById(id)
  .then((foundUser) => {
   console.log(foundUser.gameTags)
   return Game.find({genres: {$elemMatch: {description: { $in: foundUser.gameTags }}}}).limit(10)
    
  })
  .then((gamesList) => {
    //console.log(gamesList)
    res.render("recommended-games", {games: gamesList})
  })
  
}); 

module.exports = router;