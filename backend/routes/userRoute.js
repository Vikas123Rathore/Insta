import express from 'express'
import { isAuthorised } from '../middlewares/isAuth.js'
import {
  editProfile,
  getCurrentUser,
  getUserProfile,
  suggestedUser,
} from '../controllers/userController.js'
import upload from '../middlewares/multer.js'
const router = express.Router()
router.get('/getcurrentuser', isAuthorised, getCurrentUser)
router.get('/suggesteduser', isAuthorised, suggestedUser)
router.put(
  '/editprofile',
  isAuthorised,
  upload.single('profilePicture', ),
  editProfile,
)
router.get('/getuserprofile/:username', isAuthorised, getUserProfile)
export default router
