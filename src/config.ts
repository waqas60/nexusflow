import { configDotenv } from "dotenv"
configDotenv()
import mongoose from "mongoose";
const MONGO_URI = process.env.MONGO_URI

mongoose.connection.on("error", (err) => console.log("Database Connection Failed", err))

export default async  function connectToDB() {
    try {
        await mongoose.connect(MONGO_URI!)
        console.log("Database Connection Successfully")
    } catch (error) {
        console.log("Database Connection Failed", error)
        process.exit(1)
    }
}