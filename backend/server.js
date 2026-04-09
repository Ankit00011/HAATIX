import express from 'express'
import 'dotenv/config'
import connectDB from './database/db.js'
import userRoute from './routes/userRoutes.js'
import productRoute from './routes/productRoute.js'
import cartRoute from './routes/cartRoute.js'
import orderRoute from './routes/orderRoute.js'
import adminRoute from './routes/adminRoute.js'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3000

//middleware
app.use(express.json())

const normalizeOrigin = (value) => value?.replace(/\/$/, "");
const allowedOrigins = [
  normalizeOrigin(process.env.FRONTEND_URL),
  normalizeOrigin(process.env.PRODUCTION_FRONTEND_URL),
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true)
    }
    const normalizedOrigin = normalizeOrigin(origin)
    if (allowedOrigins.length === 0 || allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true)
    }
    return callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))

app.use('/api/v1/user', userRoute)
app.use('/api/v1/product', productRoute)
app.use('/api/v1/cart', cartRoute)
app.use('/api/v1/order', orderRoute)
app.use('/api/v1/admin', adminRoute)

//http://localhost:8000/api/v1/user/register

app.listen(PORT,()=>{
   connectDB()
   console.log(`Server is listening at port:${PORT}`)
})

 
