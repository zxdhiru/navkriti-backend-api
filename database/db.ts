import mongoose from "mongoose";

export default async function connectToDatabase(url: string) {
  try {
    const connection = await mongoose.connect(url);
    console.log("Database connection established", connection.connection.host, connection.connection.collection);
  } catch (error) {
    console.log("Database connection failed", error);
  }
}