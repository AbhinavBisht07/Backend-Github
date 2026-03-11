import mongoose from "mongoose";

const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to MongoDB"); // as i am using async await .. no need of then()
    } catch (err) {
        console.error("MongoDB connection failed:", err);
    }
}

export default connectToDatabase;