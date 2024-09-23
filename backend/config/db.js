import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config({path:'../../.env'});

export const connectDB = async () => {
	console.log("MongoDB URI:", process.env.MONGO_URI);
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI);
		console.log("MongoDB Connection successful!");
	} catch (error) {
		console.log("Connection Failed:", error);
        process.exit(1);
	}
};