// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS, // Use a Google "App Password", not your login password
//   },
// });

// const sendOrderEmail = async (userEmail, orderDetails) => {
//   const mailOptions = {
//     from: `"ShopEase" <${process.env.EMAIL_USER}>`,
//     to: userEmail,
//     subject: `Order Confirmed! #${orderDetails.id.slice(0, 8)}`,
//     html: `
//       <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 20px;">
//         <h2 style="color: #2563eb;">Thanks for your order!</h2>
//         <p>Hi there, we've received your order and are getting it ready.</p>
//         <hr style="border: none; border-top: 1px solid #eee;" />
//         <p><strong>Order ID:</strong> ${orderDetails.id}</p>
//         <p><strong>Total Amount:</strong> $${orderDetails.totalAmount}</p>
//         <p><strong>Shipping to:</strong> ${orderDetails.address}</p>
//         <br />
//         <a href="https://shopease.com/orders" style="background: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 10px; font-weight: bold;">View Order Status</a>
//       </div>
//     `,
//   };

//   return transporter.sendMail(mailOptions);
// };

// module.exports = { sendOrderEmail };