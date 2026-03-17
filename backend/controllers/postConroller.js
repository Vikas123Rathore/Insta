import uploadOnCloudinary from '../config/cloudinary.js'
import Post from '../models/postModel.js'
import User from '../models/usermodel.js'

export const createPost = async (req, res) => {
  try {
    const { caption, mediaType } = req.body
    let media
    if (req.file) {
      media = await uploadOnCloudinary(req.file.path)
    } else {
      return res.status(400).json({ message: 'media is required' })
    }
    const post = await Post.create({
      caption,
      media,
      mediaType,
      author: req.userId,
    })
    const user = await User.findById(req.userId)
    user.posts.push(post._id)
    await user.save()
    const populatedPost = await Post.findById(post._id).populate(
      'author',
      'name username profileImage posts',
    )
    return res.status(201).json(populatedPost)
  } catch (error) {
    return res.status(500).json({ message: `uploadPost error ${error}` })
  }
}

export const getAllPost = async (req, res) => {
  try {
    const post = await Post.find({})
      .populate('author', 'name username profileImage posts')
      .populate('comments.author', 'name username profileImage posts')
      .sort({ createdAt: -1 })

    return res.status(200).json(post)
  } catch (error) {
    return res.status(500).json({ message: `getAllPost error ${error}` })
  }
}

export const likePost = async (req, res) => {
  try {
    const { postId } = req.params
    const userId = req.userId
    const post = await Post.findById(postId)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => id.toString() !== userId)
    } else {
      post.likes.push(userId)
    }
    await post.save()
    const populatedPost = await Post.findById(postId).populate(
      'author',
      'name username profileImage posts',
    )
    return res.status(200).json(populatedPost, 'post liked successfully')
  } catch (error) {
    return res.status(500).json({ message: `likePost error ${error}` })
  }
}

export const commentPost = async (req, res) => {
  try {
    const { postId } = req.params
    const { message } = req.body
    const userId = req.userId

    if (!message) {
      return res.status(400).json({ message: 'Comment required' })
    }

    const post = await Post.findById(postId)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    // add comment
    post.comments.push({
      author: userId,
      message,
    })

    await post.save()

    // populate without extra DB call
    await post.populate('author', 'name username profileImage posts')
    await post.populate('comments.author', 'name username profileImage posts')

    return res.status(200).json({
      message: 'Comment added successfully',
      post,
    })
  } catch (error) {
    return res.status(500).json({
      message: `commentPost error ${error}`,
    })
  }
}

export const savePost = async (req, res) => {
  try {
    const { postId } = req.params
    const userId = req.userId

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // check already saved or not
    if (user.savedPosts.includes(postId)) {
      // unsave
      user.savedPosts = user.savedPosts.filter(
        id => id.toString() !== postId
      )

      await user.save()

      return res.status(200).json({
        message: "Post unsaved"
      })
    }

    // save post
    user.savedPosts.push(postId)
    await user.save()

    return res.status(200).json({
      message: "Post saved"
    })

  } catch (error) {
    return res.status(500).json({
      message: `savePost error ${error}`
    })
  }
}
