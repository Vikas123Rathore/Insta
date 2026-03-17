import User from '../models/userModel.js'
import uploadOnCloudinary from '../config/cloudinary.js'
import Loop from '../models/loopModel.js'

export const loopUpload = async (req, res) => {
  try {
    const userId = req.userId
    const { caption } = req.body
    let media
    if (req.file) {
      media = await uploadOnCloudinary(req.file.path)
    } else {
      return res.status(400).json({ message: 'media is required' })
    }
    const loop = await Loop.create({
      author: userId,
      media,
      caption,
    })
    const user = await User.findById(userId)
    user.loops.push(loop._id)
    await user.save()
    const populatedLoop = await Loop.findById(loop._id).populate(
      'author',
      'username',
    )
    return res
      .status(201)
      .json({ message: 'Loop created successfully', loop: populatedLoop })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'An error occurred while processing the request.' })
  }
}

export const getAllLoopsController = async (req, res) => {
  try {
    const loops = await Loop.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 })
    return res.status(200).json({ loops })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'An error occurred while processing the request.' })
  }
}

export const getLoopByIdController = async (req, res) => {
  try {
    const { id } = req.params
    const loop = await Loop.findById(id).populate('author', 'username')
    if (!loop) {
      return res.status(404).json({ message: 'Loop not found' })
    }
    return res.status(200).json({ loop })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'An error occurred while processing the request.' })
  }
}

export const deleteLoopController = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.userId
    const loop = await Loop.findById(id)
    if (!loop) {
      return res.status(404).json({ message: 'Loop not found' })
    }
    if (loop.author.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' })
    }
    await Loop.findByIdAndDelete(id)
    const user = await User.findById(userId)
    user.loops.pull(id)
    await user.save()
    return res.status(200).json({ message: 'Loop deleted successfully' })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'An error occurred while processing the request.' })
  }
}

export const likeLoop = async (req, res) => {
  try {
    const { loopId } = req.params
    const userId = req.userId
    const loop = await Loop.findById(loopId)
    if (!loop) {
      return res.status(404).json({ message: 'loop not found' })
    }
    if (loop.likes.includes(userId)) {
      loop.likes = loop.likes.filter((id) => id.toString() !== userId)
    } else {
      loop.likes.push(userId)
    }
    await loop.save()
    const populatedloop = await loop
      .findById(loopId)
      .populate('author', 'name username profileImage loops')
    return res.status(200).json(populatedloop, 'loop liked successfully')
  } catch (error) {
    return res.status(500).json({ message: `likeloop error ${error}` })
  }
}

export const commentLoop = async (req, res) => {
  try {
    const { loopId } = req.params
    const { message } = req.body
    const userId = req.userId

    if (!message) {
      return res.status(400).json({ message: 'Comment required' })
    }

    const loop = await Loop.findById(loopId)

    if (!loop) {
      return res.status(404).json({ message: 'loop not found' })
    }

    // add comment
    loop.comments.push({
      author: userId,
      message,
    })

    await loop.save()

    // populate without extra DB call
    await loop.populate('author', 'name username profileImage loops')
    await loop.populate('comments.author', 'name username profileImage loops')

    return res.status(200).json({
      message: 'Comment added successfully',
      loop,
    })
  } catch (error) {
    return res.status(500).json({
      message: `commentloop error ${error}`,
    })
  }
}
