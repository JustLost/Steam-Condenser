// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const Game = require("./models/Game.model");

const axios = require("axios");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

const projectName = "project2";
const capitalized = (string) => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)} created with IronLauncher`;

// 👇 Start handling routes here
const index = require("./routes/index");
app.use("/", index);

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const profileRoute = require("./routes/profile");
app.use("/", profileRoute);

//Mongo Atlas
const Cors = require("cors");
const BodyParser = require("body-parser");



app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
app.use(Cors());

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;

app.use(function (req, res, next) {
  console.log(app.locals);
  app.locals.currentUser = req.session.user;
  next();
});

(async () => {
  if (await Game.countDocuments({})) {
    return;
  }

  // let response = await axios.get(
  //   "https://steamspy.com/api.php?request=top100in2weeks"
  // );
  //console.log(Object.values(response.data)[0])

  // let games = Object.values(response.data);
  let games = [
    1307710, 359550, 1142710, 1551360, 362003, 1190000, 690790, 266410, 1190170,
    1569040, 431240, 1506830, 686810, 1659040, 440, 1144200, 268910, 367520,
    881100, 1426210, 1057090, 261570, 588650, 1599340, 534380, 1446780, 1203220,
    1085660, 252490, 1091500, 1222670, 275850,
  ];

  for (let i = 0; i < games.length; i++) {
    let gameDetails = await axios.get(
      "https://store.steampowered.com/api/appdetails",
      {
        params: {
          appids: games[i],
          key: process.env.STEAMKEY,
          language: "eng",
        },
      }
    );
    await sleep(500);
    if (
      gameDetails.data[games[i]].success &&
      gameDetails.data[games[i]].data.type === "game"
    ) {
      let data = gameDetails.data[games[i]].data;
      let steam_appid = data.steam_appid;
      //console.log(gameDetails[games[i]]);
      let name = data.name;
      let genres = data.genres;
      let about_the_game = data.about_the_game;
      let header_image = data.header_image;
      let release_date = data.release_date;
      //console.log(data.metacritic)
      let metacritic_score = data.metacritic ? data.metacritic.score : 0;
      let website = data.website;
      Game.create({
        steam_appid,
        name,
        genres,
        about_the_game,
        header_image,
        release_date,
        metacritic_score,
        website,
      })
        .then((game) => {
          console.log("created:", game.name);
          //res.redirect("");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
})();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}