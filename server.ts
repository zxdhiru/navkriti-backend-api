import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectToDatabase from "./database/db";
import cors from "cors";
import UserRouter from "./user/routes/route";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, _, next) => {
    console.log(`${req.method} ${req.path} ${req.body}`);
    next();
});
app.use(cors());

// routes
app.use("/api/user", UserRouter);
// error handling

// connect to database

connectToDatabase(`${process.env.MONGO_URI}/${process.env.MONGO_DB}`)
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error: any) => {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    });
