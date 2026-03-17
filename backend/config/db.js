import mongoose from 'mongoose'
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('mongoDB connected successfully')
  } catch (error) {
    console.error('Error in connecting to database:', error.message)

  }
}
export default connectDB
