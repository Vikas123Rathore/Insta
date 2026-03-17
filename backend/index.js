import express from'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import connectDB from './config/db.js'
import authRouter from './routes/authroute.js'
import userRouter from './routes/userRoute.js'
import postRouter from './routes/postroute.js'
import cors from 'cors'
dotenv.config()
const app = express()

const port = process.env.PORT || 8000

// default middleware
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
)
// default route
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use("/api/auth/",authRouter)
app.use("/api/user/",userRouter)
app.use("/api/post/",postRouter)
connectDB()
app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})
