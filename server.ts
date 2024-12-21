import cluster from "cluster";
import os from "os";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectToDatabase from "./database/db";
import cors from "cors";
import cookieParser from "cookie-parser";



// router imports
import UserRouter from "./user/routes/user.route";
import productRouter from "./products/routes/product.route";
import categoryRoute from "./products/routes/categoryRoute";
import reviewRoute from "./products/routes/review.route";
import cartRoute from "./user/routes/cart.route";
import couponRoute from "./products/routes/coupon.route";
import orderRoute from "./products/routes/order.route";
import wishlistRoute from "./user/routes/wishlist.route";
import addressRouter from "./user/routes/address.route";

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
    origin: 'http://localhost:5173', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true, // Allow credentials (cookies)
  };

// middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, _, next) => {
    console.log(`${req.method} ${req.path} ${req.body}`);
    next();
});
app.use(cors(corsOptions));


// routes
app.use("/api/auth", UserRouter);
app.use("/api/product", productRouter);
app.use("/api/category", categoryRoute);
app.use("/api/review", reviewRoute);
app.use("/api/cart", cartRoute);
app.use("/api/coupon", couponRoute);
app.use("api/order", orderRoute)
app.use("/api/wishlist", wishlistRoute);
app.use("/api/address", addressRouter);
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
}