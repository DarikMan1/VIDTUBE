import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
    try {
        const connectionString = process.env.MONGODB_URI;
        
        if (!connectionString) {
            throw new Error("MONGODB_URI environment variable is not defined");
        }

        if (!connectionString.startsWith('mongodb://') && !connectionString.startsWith('mongodb+srv://')) {
            throw new Error('Invalid MongoDB connection string format. Must start with mongodb:// or mongodb+srv://');
        }

        const connectionInstance = await mongoose.connect(`${connectionString}/${DB_NAME}`);
        console.log(`\n MongoDB Connected! DB HOST: ${connectionInstance.connection.host}`);

    } catch (error) {
        console.error("MONGODB connection error: ", error);
        process.exit(1);
    }
}

export default connectDB;