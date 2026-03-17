import express from 'express'
import { isAuthorised } from '../middlewares/isAuth.js'
import upload from '../middlewares/multer.js'
import { loopUpload, getAllLoopsController, getLoopByIdController, likeLoopController, commentLoopController } from '../controllers/loopController.js'
const router = express.Router()
router.post('/uploadloop', isAuthorised, upload.single('media'), loopUpload)
router.get('/all', getAllLoopsController)
router.get('/:id', getLoopByIdController)
router.post('/like/:loopId', isAuthorised, likeLoopController)
router.post('/comment/:loopId', isAuthorised, commentLoopController)

export default router
