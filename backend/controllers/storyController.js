import Story from '../models/storyModel.js'
import User from '../models/userModel.js'
import uploadOnCloudinary from '../config/cloudinary.js'
export const uploadStory = async (req, res) => {
  try {
    const user = await User.findById(req.userId)

    const { mediaType } = req.body

    let media
    if (req.file) {
      media = await uploadOnCloudinary(req.file.path)
    } else {
      return res.status(400).json({ message: 'media is required' })
    }
    const story = await Story.create({
      mediaType,
      media,
      author: req.userId,
    })
    user.storys = story._id
    await user.save()
    const populatedStory = await Story.findById(story._id)
      .populate('author', 'name userName profileImage')
      .populate('viewers', 'name userName profileImage')
    return res.status(200).json(populatedStory)
  } catch (error) {
    return res.status(500).json({ message: 'story upload error' })
  }
}

export const viewStory = async (req, res) => {
  try {
    const storyId = req.params.storyId
    const story = await Story.findById(storyId)
    if (!story) {
      return res.status(400).json({ message: 'story not found' })
    }
    const viewersIds = story.viewers.map((id) => id.toString())
    if (!viewersIds.includes(req.userId.toString())) {
      story.viewers.push(req.userId)
      await story.save()
    }
    const populatedStory = await Story.findById(story._id)
      .populate('author', 'name userName profileImage')
      .populate('viewers', 'name userName profileImage')
    return res.status(200).json(populatedStory)
  } catch (error) {
    return res.status(500).json({ message: 'story view error' })
  }
}
