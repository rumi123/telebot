const mongoose = require('mongoose')
const Menu = require('./src/models/menu')
const Dish = require('./src/models/dish')


const dish = new Dish({
    dishCode : "AF",
    dishName : "Al-Fahm",
    dishVarities : [
        {
            size: 'full',
            varitieCode: 'AF 01',
            price: 360
        },
        {
            size: 'half',
            varitieCode: 'AF 02',
            price: 180
        }
    ]
})

dish.save()