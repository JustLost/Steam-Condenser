const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const gameSchema = new Schema(
  {
    steam_appid: {
      type:Number,
      unique: true,
    },
    name: String,
    genres: [],
    about_the_game: String,
    header_image: String,
    release_date: {},
    metacritic_score: Number,
    website: String,
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Game = model("topGame", gameSchema);

module.exports = Game;
