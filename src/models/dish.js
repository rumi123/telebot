const mongoose = require('mongoose')

const dishSchema = new mongoose.Schema({
    dishCode : String,
    dishName : String,
    dishVarities : Array
})

const Dish = mongoose.model("Dish",dishSchema)
module.exports = Dish