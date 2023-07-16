
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const cors = require("cors")({origin: true});
admin.initializeApp();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "investtor111@gmail.com",
    pass: "**********", // password
  },
});
let verifyCode;
/**
 * get random number less than max.
 * @param {number} max The first number.
 * @return {number} generated random number.
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
/**
 * make always 6 digit.
 * @return {number} generated random number.
 */
function randomVerifyCodeGenerator() {
  return getRandomInt(900000) + 100000;
}
exports.sendMail = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    // get verifycode
    verifyCode = randomVerifyCodeGenerator();
    // getting dest email by query string
    const dest = req.query.dest;
    const mailOptions = {
      from: "investtor OTP <investtor111@gmail.com>", //
      to: dest,
      subject: "Email OTP for investtor", // email subject
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP</title>
</head>
<body>
    <div style="font-family: Helvetica,Arial,sans-serif;
    max-width:600px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:100%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #00466a;
        text-decoration:none;font-weight:600">investtor</a>
      </div>
      <p style="font-size:1.1em">Hi,</p>
      <p>Thank you for choosing investtor. Use the following OTP to
      complete your Sign Up procedures.</p>
      <h2 style="background: #00466a;margin: 0 auto;width: max-content;
      padding: 0 10px;color: #fff;border-radius: 4px;">
        ${verifyCode}</h2>
      <p style="font-size:0.9em;">Regards,<br />investtor</p>
    </div>
  </div>
</body>
</html>`,
    };
    // returning result
    return transporter.sendMail(mailOptions, (erro, info) => {
      if (erro) {
        return res.send(erro.toString());
      }
      return res.send(`${verifyCode}`);
    });
  });
});
