import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb://127.0.0.1:27017/ticket-system');
        console.log(`Success: ${conn.connection.host}`)
    } catch (error) {
        console.log(`Success: ${error.message}`)
        process.exit();
    }
}

export default connectDB;