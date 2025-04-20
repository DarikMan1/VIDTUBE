import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dotenv from 'dotenv';
dotenv.config();
const connectionString = process.env.MONGODB_URI || "";
console.log("MongoDB URI: ", connectionString);
const connectDB = async ()=>{
    try{
       const connection = await mongoose.connect(`${connectionString}/${DB_NAME}`);
       console.log(`MongoDB Connected : ${connection.connection.host}`);
    }catch(err){
        console.log("MongoDb Connection Error",err);
        process.exit(1);
    }
}

export default connectDB;