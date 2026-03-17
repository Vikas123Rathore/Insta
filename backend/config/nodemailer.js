import nodemailer from 'nodemailer'
import dotenv from "dotenv"
dotenv.config()
const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 465,
  secure: true, // Use true for port 465, false for port 587
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.MAIL_PASS,
  },
})
export default transporter
