
require("dotenv").config();
const keys = require("./keys.js");
const http = require('http');

const axios = require("axios");

const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const argsArr = process.argv.slice(2);

console.log("argsArr(s) ---> ", argsArr);

// http.createServer(function (request, response) {
// console.log("server created")
// const moment = require("moment");
// const fs = require("fs");

// console.log("Request received ---> ", request)

let counter = 0;

const transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: keys.heroku.user,
    pass: keys.heroku.pass
  }
}));

// const mailOptions = {
//   from: 'cpharshaw@gmail.com',
//   to: 'cpharshaw@gmail.com',
//   subject: 'PS5 stock checker - potential inventory found at BestBuy',
//   html: "PS5 stock checker - potential inventory found at BestBuy"
// };

const mailOptions = {
  from: 'resteasydev@gmail.com',
  to: 'trigger@applet.ifttt.com',
  subject: 'PS5 in stock at BestBuy - email using Nodemailer: (#ps5_stock)',
  html: "#ps5_stock <a href='https://www.bestbuy.com/site/sony-playstation-5-console/6426149.p?skuId=6426149'>https://www.bestbuy.com/site/sony-playstation-5-console/6426149.p?skuId=6426149"
};

// transporter.sendMail(mailOptionsTest, function (error, info) {
//   if (error) {
//     console.log("some kind of error");
//   } else {
//     console.log("test log of email in heroku.  testing successful");
//   }
// });



const bbPS5Call = param => {

  const date = new Date();
  const hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  const minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  const second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  const time = hour + ":" + minute + ":" + second;

  if (hour >= 7 && hour < 25) {
    counter++;

    axios.get("https://www.bestbuy.com/site/sony-playstation-5-console/6426149.p?skuId=6426149")
      .then(res => {
        let data = res.data;

        const searchAvailability = data.search('id="shop-buying-options');

        if (searchAvailability > 0) {
          console.log(time + " - PS5 in stock at BB!!!!!!!!", counter);
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) console.log(error);
          });
          return;
        }
        console.log(time + " - not in stock :-(", counter);
      })
      .catch(err => {
        console.log(err);
      })
  };
};


bbPS5Call(argsArr[0]);

const intervalCheck = setInterval(() => {
  bbPS5Call(argsArr[0]);
}, 20000);

// })
// .listen(process.env.PORT || 5000);


// https://stackoverflow.com/questions/41889672/deploy-nodejs-app-without-http-server-on-heroku
// FOR EMAIL
// https://stackoverflow.com/questions/19877246/nodemailer-with-gmail-and-nodejs