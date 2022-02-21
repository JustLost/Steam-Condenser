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

(async () => {
    if( await Game.countDocuments({})){
        return
    }
    
    let response = await axios.get(
    "http://api.steampowered.com/ISteamApps/GetAppList/v0002/?format=json"
    );
    console.log(response.data.applist)


    for (let i = 0; i < 100000; i++) {
    let gameDetails = await axios.get(
      "https://store.steampowered.com/api/appdetails",
      {
        params: {
          appids: response.data.applist.apps[i].appid,
          key:process.env.STEAMKEY
        }
      }
    );
    if (gameDetails.data[response.data.applist.apps[i].appid].success && (gameDetails.data[response.data.applist.apps[i].appid].data.type === "game") ) {
        let data = gameDetails.data[response.data.applist.apps[i].appid].data;
        let steam_appid = data.steam_appid;
        //console.log(gameDetails[response.data.applist.apps[i].appid]);
        console.log(data.steam_appid);
        let name = data.name;
        let genres = data.genres;
        let about_the_game = data.about_the_game;
        let header_image = data.header_image;
        let release_date = data.release_date;
        Game.create({
          steam_appid,
          name,
          genres,
          about_the_game,
          header_image,
          release_date,
        })
        .then((game) => {
          console.log("game created", game.name);
          //res.redirect("");
        })
        .catch((err) => {
          console.log(err);
        });
    }
    }
})();
