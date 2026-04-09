import mongoose from "mongoose";
import { Config } from "./config.js";

const connectToDatabase = async ()=>{
    await mongoose.connect(Config.MONGO_URI);
    console.log("Connected to MongoDb");
}


export default connectToDatabase;