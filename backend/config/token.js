import jwt from 'jsonwebtoken'
export const genToken= async(userId)=>{
  try {
let token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' })
return token
  } catch (error) {
return res.status(500).json({
  success: false,
  message: 'Error in generating token',
  error: error.message,
})
console.log('Error in generating token', error)
  }
}
