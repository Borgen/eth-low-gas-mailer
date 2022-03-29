"use strict";

const Nodemailer = require("nodemailer");
const Handlebars = require("handlebars");
const Fs = require("fs");

var toList = process.env.TOLIST;

if (toList) {
  console.log("Mail gönderilecekler listesi: " + toList);
} else {
  toList = "***REMOVED***";
  console.log("Mail gönderilecekler listesi: " + toList);
}

module.exports = {

  send : async function send(avgGasPrice, lastBlockNumber) {
    Fs.readFile("./email.html", "utf-8", (error, htmlContent) => {
      if (error) {
        console.log("E-Posta dosyası okunurken hata alındı!", error);
        return;
      }

      let template = Handlebars.compile(htmlContent);
      let replacements = {
        gasPrice : avgGasPrice,
        lastBlockNumber : lastBlockNumber
      };
      let htmlResultContent = template(replacements);
      sendMail(htmlResultContent);
    });
  }

};

async function sendMail(htmlResultContent) {

  let transporter = Nodemailer.createTransport({
    host : "smtp.gmail.com",
    port : 587,
    secure : false, // true for 465, false for other ports
    auth : {user : "***REMOVED***", pass : "***REMOVED***"},
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from : '"Eth Pompacısı" <***REMOVED***>', // sender address
    to : toList,                                    // list of receivers
    subject :
        "Ortalama Eth Gaz Fiyatı Düşük! 💲✂️💰", // Subject line
    html : htmlResultContent
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}
