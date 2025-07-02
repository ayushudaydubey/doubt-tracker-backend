import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './src/routes/userRoutes.js';
import rateLimiter from './src/middleware/rateLimiter.js';
import cors from 'cors';
import { connectDB } from './src/config/db.js';
import errorHandler from './src/middleware/errorHandler.js';

dotenv.config();
const app = express();


connectDB();

const allowedOrigins = [
  "http://localhost:5173",
  "https://doubt-tracker-frontend.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(rateLimiter);


app.use('/', userRoutes);
// app.use('/doubts', doubtRoutes);
// app.use('/comments', commentRoutes);

// Error handler
app.use(errorHandler);



app.listen(3000, () => {
  console.log(`Server is running `);
});
