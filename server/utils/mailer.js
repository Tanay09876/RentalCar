import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

export const sendOTPEmail = async (to, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject: "Your OTP Code",
    text: `Your OTP for password reset is: ${otp}`
  });
};

export const sendWelcomeEmail = async (to, name) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject: "Welcome to Car Rental App",
    text: `Hello ${name}, welcome to our platform!`
  });
};
