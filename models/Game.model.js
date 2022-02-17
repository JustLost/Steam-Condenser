const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const gameSchema = new Schema(
  {
    name: String,
    category: String,
    description: String,
    imageUrl: String,
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Game = model("Game", gameSchema);

module.exports = Game;
