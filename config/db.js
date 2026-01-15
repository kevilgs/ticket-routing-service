import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import logger from "../utils/logger.js";
configDotenv();
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        logger.info(`Success: ${conn.connection.host}`)
    } catch (error) {
        logger.info(`Error: ${error.message}`)
        processs.exit(1);
    }
}

export default connectDB;