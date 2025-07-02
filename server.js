import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import userRoutes from  './src/routes/userRoutes.js'
import rateLimiter from './src/middleware/rateLimiter.js';
import cors from 'cors';
import { connectDB } from './src/config/db.js';
import errorHandler from './src/middleware/errorHandler.js';

dotenv.config();
const app = express();

connectDB();

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(rateLimiter);

app.use('/', userRoutes);
// app.use('//doubts', doubtRoutes);
// app.use('//comments', commentRoutes);

app.use(errorHandler);


app.listen(3000,()=>{
  connectDB()
  console.log("Server is Running ")
})
