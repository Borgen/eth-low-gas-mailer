"use strict";

const nodemailer = require("nodemailer");


var toList = process.env.TOLIST;

if(toList){    
    console.log("Mail gönderilecekler listesi: " + toList);
}
else{
    toList = "***REMOVED***";    
    console.log("Mail gönderilecekler listesi: " + toList);
}

// async..await is not allowed in global scope, must use a wrapper
module.exports = {

    send: async function send(avgGasPrice) {

        // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: "***REMOVED***", 
          pass: "***REMOVED***"
        },
      });

      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"Eth Pompacısı" <***REMOVED***>', // sender address
        to: toList, // list of receivers
        subject: "Ortalama Eth Gaz Fiyatı Düşük! ✔", // Subject line
        text: "Ortalama fiyat: " + avgGasPrice // plain text body
      });

      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

}

};
