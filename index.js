
require("dotenv").config();
const keys = require("./keys.js");
const http = require('http');

const axios = require("axios");

const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');


http.createServer(function (request, response) {

  // const moment = require("moment");
  // const fs = require("fs");

  const argsArr = process.argv.slice(2);

  const command = argsArr[0].trim();
  let param = argsArr.slice(1).join(" ").trim();
  param = param.length > 0 ? param : undefined;


  let foundIndicator = false;

  let counter = 0;

  const transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: keys.heroku.user,
      pass: keys.heroku.pass
    }
  }));

  const mailOptionsTest = {
    from: 'resteasydev@gmail.com',
    to: 'resteasydev@gmail.com',
    subject: 'test, deployed to Heroku',
    html: "test of html body, deployed to Heroku"
  };

  const mailOptions = {
    from: 'resteasydev@gmail.com',
    to: 'trigger@applet.ifttt.com',
    subject: 'PS5 in stock at BestBuy - email using Nodemailer: (#ps5_stock)',
    html: "#ps5_stock <a href='https://www.bestbuy.com/site/sony-playstation-5-console/6426149.p?skuId=6426149'>https://www.bestbuy.com/site/sony-playstation-5-console/6426149.p?skuId=6426149"
  };

  transporter.sendMail(mailOptionsTest, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("test log of email in heroku.  testing successful");
    }
  });



  const bbPS5Call = param => {
    axios.get("https://www.bestbuy.com/site/sony-playstation-5-console/6426149.p?skuId=6426149")
      .then(res => {
        let data = res.data;

        const searchAvailability = data.search('id="shop-buying-options');

        if (searchAvailability > 0) {
          foundIndicator = true;
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("PS5 in stock at BB!!!!!!!!", counter, info.response);
            }
          });
          return console.log("PS5 in stock at BB!!!!!!!!", counter);
        } else {
          return console.log("not in stock :-(", counter);
        }

      })
      .catch(err => {
        console.log(err);
      })
  };



  const intervalCheck = setInterval(() => {
    const date = new Date();
    const hour = date.getHours();
    const minute = date.getMinutes();

    if (hour >= 7 && hour < 25) {
      counter++;
      if (!foundIndicator) console.log("no PS5 stock found at BestBuy", counter);
      if (foundIndicator) {
        bbPS5Call("ps5");
        clearInterval(intervalCheck);
      }
    }
  }, 300000);

}).listen(keys.heroku.port || 5000);



// FOR EMAIL
// https://stackoverflow.com/questions/19877246/nodemailer-with-gmail-and-nodejs