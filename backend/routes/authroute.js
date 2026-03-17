import express from 'express'
import { forgetPassword, resetPassword, signin, signout, signup } from '../controllers/authControllers.js'
const router = express.Router()
router.post('/register',signup)
router.post("/login",signin)
router.get("/logout",signout)
router.post("/forgetpassword",forgetPassword)
router.post("/resetpassword",resetPassword)
export default router
