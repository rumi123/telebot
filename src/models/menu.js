const mongoose = require('mongoose')

const menuSchema = new mongoose.Schema({
    menuCode : String,
    dishes : Array
})

const Menu = mongoose.model("Menu",menuSchema)
module.exports = Menu