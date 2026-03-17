import express from 'express'
import { isAuthorised } from '../middlewares/isAuth.js'
import upload from '../middlewares/multer.js'
import {
  createPost,
  getAllPost,
  likePost,
  commentPost,
  savePost,
} from '../controllers/postConroller.js'
const router = express.Router()
router.post('/createpost', isAuthorised, upload.single('media'), createPost)
router.get('/getallpost', isAuthorised, getAllPost)
router.post('/likepost/:postId', isAuthorised, likePost)
router.post('/commentpost/:postId', isAuthorised, commentPost)
router.post('/savepost/:postId', isAuthorised, savePost)
export default router
