import { configDotenv } from "dotenv";
configDotenv();

export const MONGO_URI = process.env.MONGO_URI;
