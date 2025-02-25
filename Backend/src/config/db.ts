import mongoose from "mongoose";
import { env } from './env.config'

const connectDB = async () => {
    try {
        await mongoose.connect(env.MONGODB_URL as string)
        console.log('MongoDB connected');
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

export default connectDB;