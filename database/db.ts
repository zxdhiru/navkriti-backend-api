import mongoose from "mongoose";

export default async function connectToDatabase(url: string) {
  try {
    const connection = await mongoose.connect(url);
    console.log("Database connection established", connection.connection.host);
  } catch (error) {
    console.log("Database connection failed", error);
    process.exit(1);
  }
}