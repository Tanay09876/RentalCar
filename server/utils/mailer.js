// server/utils/mailer.js
import nodemailer from "nodemailer";

// Create transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER, // your Gmail
    pass: process.env.SMTP_PASS, // your Gmail App Password
  },
});

// ✅ Generic Email Sender
export const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"Rental Car" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
    throw error;
  }
};

// ✅ OTP Email Sender
export const sendOTPEmail = async (to, otp) => {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 10px;">
      <h2 style="color: #007bff;">Your OTP Code</h2>
      <p>Your OTP for password reset is: <strong>${otp}</strong>.</p>
      <p>This OTP is valid for <strong>10 minutes</strong>.</p>
      <p style="color: gray; font-size: 12px;">Please do not share this code with anyone.</p>
    </div>
  `;
  await sendEmail(to, "Your OTP Code", html);
};

// ✅ Welcome Email Sender
export const sendWelcomeEmail = async (to, name) => {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 10px;">
      <h2 style="color: #007bff;">Welcome to Rental Car!</h2>
      <p>Hello <strong>${name}</strong>,</p>
      <p>We're excited to have you on board. Start booking your favorite rides today!</p>
      <p style="color: gray; font-size: 12px;">If you have any questions, reply to this email.</p>
    </div>
  `;
  await sendEmail(to, "Welcome to Car Rental App", html);
};

// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.EMAIL_PASS
//   }
// });

// export const sendOTPEmail = async (to, otp) => {
//   await transporter.sendMail({
//     from: process.env.EMAIL,
//     to,
//     subject: "Your OTP Code",
//     text: `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`
//   });
// };

// export const sendWelcomeEmail = async (to, name) => {
//   await transporter.sendMail({
//     from: process.env.EMAIL,
//     to,
//     subject: "Welcome to Car Rental App",
//     text: `Hello ${name}, welcome to our platform!`
//   });
// };












// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.EMAIL_PASS
//   }
// });

// export const sendOTPEmail = async (to, otp) => {
//   await transporter.sendMail({
//     from: process.env.EMAIL,
//     to,
//     subject: "Your OTP Code",
//     text: `Your OTP for password reset is: ${otp}`
//   });
// };

// export const sendWelcomeEmail = async (to, name) => {
//   await transporter.sendMail({
//     from: process.env.EMAIL,
//     to,
//     subject: "Welcome to Car Rental App",
//     text: `Hello ${name}, welcome to our platform!`
//   });
// };