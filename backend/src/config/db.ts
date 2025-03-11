import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI as string, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1);
    }
};

export default connectDB;
