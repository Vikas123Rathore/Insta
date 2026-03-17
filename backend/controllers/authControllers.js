import bcrypt from 'bcryptjs'
import User from '../models/userModel.js'
import { genToken } from '../config/token.js'
import transporter from '../config/nodemailer.js'
export const signup = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: 'Request body is missing' })
    }
    const { name, username, email, password } = req.body
    let user = await User.findOne({ email })
    if (!name | !email || !password || !name || !username) {
      return res.status(400).json({ message: 'All fields are required' })
    }
    if (user) {
      return res.status(400).json({ message: 'User already exists' })
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters' })
    }
    const hashPassword = await bcrypt.hash(password, 10)
    let newUser = await User.create({
      name,
      username,
      email,
      password: hashPassword,
    })
    // token generate
    let token = await genToken(newUser._id)
    // 🍪 set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: newUser,
    })
  } catch (error) {
    console.log('Error in registering user', error)
    return res.status(500).json({
      message: 'Error in registering user',
      error: error.message,
    })
  }
}

export const signin = async (req, res) => {
  try {
    const { username, password } = req.body
    let user = await User.findOne({ username })
    if (!password || !username) {
      return res
        .status(400)
        .json({ message: 'All fields are required for this' })
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'user doesn`t register',
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      })
    }
    // token generate
    let token = await genToken(user._id)
    // 🍪 set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })
    res.status(201).json({
      success: true,
      message: 'User signed in successfully',
      user,
    })
  } catch (error) {
    console.log('Error in registering user', error)
    return res.status(500).json({
      message: 'Error in registering user',
      error: error.message,
    })
  }
}

// signout user
export const signout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })
    res.status(200).json({
      success: true,
      message: 'User  logout successfully',
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Error in signing out user',
      error: error.message,
    })
  }
}

// forget password
export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) {
      return res.status(400).json({ message: 'Email is required' })
    }
    let user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'User not found' })
    }
    let otp = Math.floor(100000 + Math.random() * 900000).toString()
    user.passwordResetOtp = otp
    user.passwordResetOtpExpireAt = Date.now() + 10 * 60 * 1000
    const sentMailOptions = {
      from: process.env.USER_EMAIL,
      to: user.email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`,
    }
    await transporter.sendMail(sentMailOptions)
    await user.save()
    return res.status(200).json({
      success: true,
      message: 'OTP sent to email successfully',
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error in forget password',
      error: error.message,
    })
  }
}

// password reset
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' })
    }
    let user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'User not found' })
    }
    if (
      user.passwordResetOtp !== otp ||
      user.passwordResetOtpExpireAt < Date.now()
    ) {
      return res.status(400).json({ message: 'Invalid or expired OTP' })
    }
    const hashPassword = await bcrypt.hash(newPassword, 10)
    user.password = hashPassword
    user.passwordResetOtp = ''
    user.passwordResetOtpExpireAt = 0
    await user.save()
    return res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error in resetting password',
      error: error.message,
    })
  }
}
