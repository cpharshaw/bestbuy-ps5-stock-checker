
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const keys = require("./keys.js");

const app = express();
const PORT = process.env.PORT || 5000;

// router.use(express.urlencoded({ extended: true }));
// router.use(express.json());

// const argsArr = process.argv.slice(2);
// console.log("argsArr(s) ---> ", argsArr);

let counter = 0;

app.get("/ps5/bestbuy", function (req, res) {


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

  const date1 = new Date();
  const hour1 = date1.getHours() < 10 ? "0" + date1.getHours() : date1.getHours();
  const minute1 = date1.getMinutes() < 10 ? "0" + date1.getMinutes() : date1.getMinutes();
  const second1 = date1.getSeconds() < 10 ? "0" + date1.getSeconds() : date1.getSeconds();
  const time1 = hour1 + ":" + minute1 + ":" + second1;


  const bbPS5Call = param => {

    console.log("bbPS5Call executed...")

    const date = new Date();
    const hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    const minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    const second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    const time = hour + ":" + minute + ":" + second;

    // if (hour >= 7 && hour < 25) {

    counter++;

    axios.get("https://www.bestbuy.com/site/sony-playstation-5-console/6426149.p?skuId=6426149")
      .then(res => {
        console.log("axios get...");
        
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
    // };

  };
  
  console.log("started app, counter: ", counter, "; date and time: ", date1, time1);

  if (counter == 0) {
    bbPS5Call();
    const intervalCheck = setInterval(() => {
      bbPS5Call();
    }, 20000);
    res.send("looking for PS5's at BestBuy...");
  } else {
    console.log("counter else, ", counter);
  }


});



app.listen(PORT, function () {
  console.log(`🌎 ==> API server now on port ${PORT}! counter=${counter}`);
});


// https://stackoverflow.com/questions/41889672/deploy-nodejs-app-without-http-server-on-heroku
// FOR EMAIL
// https://stackoverflow.com/questions/19877246/nodemailer-with-gmail-and-nodejs