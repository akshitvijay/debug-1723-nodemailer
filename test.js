// node 20
// npm i nodemailer url
// run with node test.js

const nodemailer = require("nodemailer");
const urllib = require("url"); //URL module that nodemailer uses


const PROBLEMATIC_URL = "smtp://user@mail-serv1.domain.com:Al#$A@1@localhost:1025"

console.log(urllib.parse(PROBLEMATIC_URL,true)); //DOESNT THROW GIVES MESSED UP OBJECT This is what nodemailer uses

try{
  const parsedObj = new URL(PROBLEMATIC_URL); //THROWS
  console.log(parsedObj);
} catch(err){
  console.log(err);
}

//THE FOLLOWING WORKS
const username = encodeURIComponent('user@mail-serv1.domain.com');
const password = encodeURIComponent('Al#$A@1');
const NON_PROBLEMATIC_SMTP_URL = `smtp://${username}:${password}@localhost:1025`;

console.log(urllib.parse(NON_PROBLEMATIC_SMTP_URL,true)); //WORKS WELL

const transporter = nodemailer.createTransport(NON_PROBLEMATIC_SMTP_URL);

const mailOptions = {
  from: "some.source.email@email.com",
  to: "some.destination.email@email.com",
  subject: "Sending Email with Nodemailer",
  text: "Hello from Nodemailer!",
};

// Send email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log(`Error occurred: ${error}`);
  }
  console.log(`Message sent successfully: ${info.response}`);
});
