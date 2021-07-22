const { text } = require('express')
const express = require('express')
const telegramBot = require('node-telegram-bot-api')
const mongoose = require('mongoose')
const data = require("./data")

const app = express()

mongoose.connect("mongodb://localhost:27017/teleShop", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const token = "1908747465:AAGSoje1vVoZz-NpRcD4zgotY3T7fsAdGPA"

const bot = new telegramBot(token,{polling:true})

var messageId 

var cart = [
    {
        item: "item 1 ",
        quantity: 2,
        price: 480
    },
    {
        item: "item 2",
        quantity: 3,
        price: 500
    }
]



bot.on("message",(msg) => {
    const buttons = []
    messageId = msg.message_id
    data.forEach(element => {
        buttons.push(new Array({text:element.name,callback_data:element.itemCode}))
    });
    
    bot.sendMessage(msg.chat.id,"List of food items",{
        reply_markup:{inline_keyboard:buttons}
    })
    bot.deleteMessage(msg.chat.id,messageId)
})

bot.on("callback_query",function onCallbackQuery(callbackQuery) {
    const action = callbackQuery.data
    const msg = callbackQuery.message
    if(action.length == 2){
        data.forEach(dish => {
            if(dish.itemCode == action){
    
                const types = dish.variety
                const buttons = []
                types.forEach(element => {
                    buttons.push(new Array({text:`${element.size} -- Rs. ${element.price}`,callback_data:element.subCode}))
                });
                buttons.push(new Array({text:"Go back",callback_data:"menu"}))
    
                bot.sendMessage(msg.chat.id,`${dish.name}`,{
                    reply_markup:{
                        inline_keyboard:buttons
                    }
                })
            }
        });
    }
    if(action.length == 5){
        const ids = action.split(" ")
        data.forEach(dish => {
            if(dish.itemCode == ids[0]){
                const types = dish.variety
                types.forEach(type => {
                    if(type.subCode == action){
                        bot.sendMessage(msg.chat.id,`${dish.name} \n ${type.size} \n ${type.price}`,{
                            reply_markup:{
                                inline_keyboard:[
                                    [
                                        {text:"Cart",callback_data:"Cart"}
                                    ],
                                    [
                                        {text:"Go back",callback_data: dish.itemCode}
                                    ]
                                ]
                            }
                        })
                    }
                });
            }
        });
    }
    if(action == "Cart"){
        let response = ""
        let total = 0
        cart.forEach(element => {
            response += `${element.item} \n Quantity: ${element.quantity} \n Price: ${element.quantity * element.price} \n \n`
            itemSum = element.quantity * element.price
            total = total + itemSum
        });
        bot.sendMessage(msg.chat.id,response + `${total}`)
    }
    if(action == "menu"){
        const buttons = []
    messageId = msg.message_id
    data.forEach(element => {
        buttons.push(new Array({text:element.name,callback_data:element.itemCode}))
    });
    
    bot.sendMessage(msg.chat.id,"List of food items",{
        reply_markup:{inline_keyboard:buttons}
    })
    }
    bot.deleteMessage(msg.chat.id,msg.message_id)
})

app.listen(1880,() => {console.log("server running");})