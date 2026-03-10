import mongoose from "mongoose"
import "dotenv/config"

export const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log('Database connected');
        })
        await mongoose.connect(process.env.MONGO_URI)
    } catch (error) {
        console.error('MongoDB connection error:', error);
        // Ensure the process exits if the database connection fails
        process.exit(1);
    }
}