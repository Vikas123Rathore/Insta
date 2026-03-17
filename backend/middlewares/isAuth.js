import jwt from 'jsonwebtoken'
export const isAuthorised = (req, res, next) => {
  try {
    const token = req.cookies.token

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

    if (!decoded) {
      return res.status(401).json({ message: 'token is not valid' })
    }
    req.userId = decoded.userId
    next()
  } catch (error) {
    console.log('error in isAuthorised middleware', error)
  }
}
