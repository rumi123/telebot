var mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  chatId: Number,
  dishCode: String,
  dishName: String,
  dishSize: String,
  unitPrice: Number,
  quantity: Number,
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
