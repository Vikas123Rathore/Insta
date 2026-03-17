import uploadOnCloudinary from '../config/cloudinary.js'
import User from '../models/usermodel.js'

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId
    const user = await User.findById(userId).select('-password')
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }
    return res.status(200).json({
      success: true,
      message: 'User found',
      user,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    })
  }
}

export const suggestedUser = async (req, res) => {
  const userId = req.userId
  try {
    const user = await User.find({
      _id: { $ne: userId },
    }).select('-password').limit(4)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }
    return res.status(200).json({
      success: true,
      message: 'suggested user found',
      user,
    })
  } catch (error) {}
}

export const editProfile = async (req, res) => {
  try {
    const { name, username, bio, gender, profession } = req.body
    const userId = req.userId
    let profilePicture
    if (req.file) {
      profilePicture = await uploadOnCloudinary(req.file.path)
    }
    const user = await User.findById(userId).select('-password')
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }
    const sameUserWithUserName = await User.findOne({ username }).select(
      '-password',
    )
    if (sameUserWithUserName && sameUserWithUserName._id != userId) {
      return res.status(400).json({
        success: false,
        message: 'username already exist',
      })
    }
    if (name) {
      user.name = name
    }
    if (username) {
      user.username = username
    }
    if (bio) {
      user.bio = bio
    }
    if (gender) {
      user.gender = gender
    }
    if (profession) {
      user.profession = profession
    }
    if (profilePicture) {
      user.profileImage = profilePicture
    }

    await user.save()
    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user,
    })
  } catch (error) {
    console.log('error in editProfile controller', error)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    })
  }
}

export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params
    const user = await User.findOne({ username }).select('-password')
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }
    return res.status(200).json({
      success: true,
      message: 'User found with username',
      user,
    })
  } catch (error) {
    console.log('error in getUserProfile controller', error)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    })
  }
}
