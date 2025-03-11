import express from 'express';
import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postRoutes';
import { authMiddleware } from './middleware/authMiddleware';
import userRoutes from './routes/userRoutes';
import cors from 'cors';
import connectDB from './config/db';
import cookieParser from 'cookie-parser';

const app = express();


connectDB();


// Configure CORS
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
  };
  app.use(cors(corsOptions));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use((req, res, next) => {
    console.log('Request body middleware:', req.body);
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/posts', authMiddleware, postRoutes);


export default app;


