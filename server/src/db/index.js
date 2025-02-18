import mongoose from "mongoose";
import { DB_NAME } from "../utils/constants.js";

const connectDB = async () => {
    try {
        const connectioInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MongoDB connected!  DB Host: ${connectioInstance.connection.host}`);

    } catch (error) {
        console.log("MongoDB onnection error", error)
        process.exit(1)
    }
}

export default connectDB