// const nodemailer = require("nodemailer");

// const sendEmail = async (options) => {
//   // 1. Create a transporter
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST, // e.g., smtp.mailtrap.io or smtp.gmail.com
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   // 2. Define email options
//   const mailOptions = {
//     from: "ShopEase Support <support@shopease.com>",
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//     html: options.html, // You can send styled HTML
//   };

//   // 3. Send the email
//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;