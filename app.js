const { text } = require("express");
const express = require("express");
const telegramBot = require("node-telegram-bot-api");
const mongoose = require("mongoose");
const data = require("./data");
const Menu = require("./src/models/menu");
const Dish = require("./src/models/dish");
const Cart = require("./src/models/cart");

const app = express();

mongoose.connect("mongodb://172.105.47.8:50003/teleShop", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const token = "";

const bot = new telegramBot(token, { polling: true });

var messageId;

const dish = new Dish({
  dishCode: "SW",
  dishName: "Shawayi",
  dishOptions: [
    {
      dishSize: "Full",
      sizeCode: "SW 01",
      unitPrice: 400,
    },
    {
      dishSize: "Half",
      sizeCode: "SW 02",
      unitPrice: 200,
    },
    {
      dishSize: "Quarter",
      sizeCode: "SW 03",
      unitPrice: 100,
    },
  ],
});

dish.save();

bot.on("message", (msg) => {
  messageId = msg.message_id;
  Dish.find((err, dishData) => {
    let buttons = [];
    dishData.forEach((dish) => {
      buttons.push(
        new Array({
          text: dish.dishName,
          callback_data: dish.dishCode,
        })
      );
    });
    bot.sendMessage(msg.chat.id, "List of food items", {
      reply_markup: { inline_keyboard: buttons },
    });
  });
  bot.deleteMessage(msg.chat.id, messageId);
});

bot.on("callback_query", function onCallbackQuery(callbackQuery) {
  const action = callbackQuery.data;
  const msg = callbackQuery.message;
  storage.push(action);
  console.log(storage);
  // console.log(action);
  if (action.length == 2) {
    Dish.findOne({ dishCode: action }, (err, dishData) => {
      options = dishData.dishOptions;
      // console.log(options);
      let buttons = [];
      options.forEach((option) => {
        buttons.push(
          new Array({
            text: `${option.dishSize}\n${option.unitPrice}`,
            callback_data: option.sizeCode,
          })
        );
      });
      buttons.push(new Array({ text: "GO Back", callback_data: "menu" }));
      bot.sendMessage(msg.chat.id, `${dishData.dishName}`, {
        reply_markup: { inline_keyboard: buttons },
      });
    });
  }
  if (action.length == 5) {
    const ids = action.split(" ");
    Dish.findOne({ dishCode: ids[0] }, (err, dishData) => {
      options = dishData.dishOptions;
      options.forEach((option) => {
        if (option.sizeCode == action) {
          cartItem = {
            chatId: msg.chat.id,
            dishCode: action,
            dishName: dishData.dishName,
            dishSize: option.dishSize,
            unitPrice: option.unitPrice,
          };
          const item = new Cart(cartItem);
          item.save();
          let buttons = [];
          for (i = 1; i <= 5; i++) {
            buttons.push(
              new Array({
                text: `${i}`,
                callback_data: `${option.sizeCode} ${i}`,
              })
            );
          }
          bot.sendMessage(msg.chat.id, "Select quantity", {
            reply_markup: { inline_keyboard: buttons },
          });
        }
      });
    });
  }
  if (action.length == 7) {
    const ids = action.split(" ");
    Cart.updateOne(
      { chatId: msg.chat.id, dishCode: `${ids[0]} ${ids[1]}` },
      { quantity: ids[2] },
      (err) => {
        if (!err) {
          Cart.find((err, cartData) => {
            let sum = 0;
            cartData.forEach((item) => {
              itemTotal = item.quantity * item.unitPrice;
              cartMessage = `${item.dishName}\n${item.dishSize}\n${item.quantity}\n${itemTotal}`;
              sum = sum + itemTotal;
              bot.sendMessage(msg.chat.id, cartMessage);
            });
            bot.sendMessage(msg.chat.id, `Total Amount: ${sum}`, {
              reply_markup: {
                inline_keyboard: [
                  [{ text: "proceed to Checkout", callback_data: "Checkout" }],
                  [{ text: "Continue Shopping", callback_data: "menu" }],
                ],
              },
            });
          });
        }
      }
    );
  }
  if (action == "Cart") {
    let response = "";
    let total = 0;
    cart.forEach((element) => {
      response += `${element.item} \n Quantity: ${element.quantity} \n Price: ${
        element.quantity * element.price
      } \n \n`;
      itemSum = element.quantity * element.price;
      total = total + itemSum;
    });
    bot.sendMessage(msg.chat.id, response + `${total}`);
  }
  if (action == "menu") {
    messageId = msg.message_id;
    Dish.find((err, dishData) => {
      let buttons = [];
      dishData.forEach((dish) => {
        buttons.push(
          new Array({ text: dish.dishName, callback_data: dish.dishCode })
        );
      });
      bot.sendMessage(msg.chat.id, "List of food items", {
        reply_markup: { inline_keyboard: buttons },
      });
    });
  }
  if (action == "Checkout") {
    Cart.deleteMany((err) => {});
    bot.sendMessage(msg.chat.id, "Thank you for shopping");
  }
  bot.deleteMessage(msg.chat.id, msg.message_id);
});

app.listen(1880, () => {
  console.log("server running");
});
