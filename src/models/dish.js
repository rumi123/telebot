const mongoose = require("mongoose");

const dishSchema = new mongoose.Schema({
  dishCode: String,
  dishName: String,
  dishOptions: [
    {
      dishSize: String,
      sizeCode: String,
      unitPrice: Number,
    },
  ],
});

const Dish = mongoose.model("Dish", dishSchema);
module.exports = Dish;
