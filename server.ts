import cluster from "cluster";
import os from "os";
import express, { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import connectToDatabase from "./database/db";
import cors from "cors";
import cookieParser from "cookie-parser";

// Router imports
import UserRouter from "./user/routes/user.route";
import productRouter from "./products/routes/product.route";
import categoryRoute from "./products/routes/categoryRoute";
import reviewRoute from "./products/routes/review.route";
import cartRoute from "./user/routes/cart.route";
import couponRoute from "./products/routes/coupon.route";
import orderRoute from "./products/routes/order.route";
import wishlistRoute from "./user/routes/wishlist.route";
import addressRouter from "./user/routes/address.route";

dotenv.config();

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary process ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.error(
      `Worker ${worker.process.pid} died with code: ${code}, signal: ${signal}. Restarting...`
    );
    cluster.fork();
  });
} else {
  const app = express();
  const port = process.env.PORT || 3000;

  if (!process.env.MONGO_URI || !process.env.MONGO_DB) {
    console.error("MONGO_URI or MONGO_DB environment variable is missing!");
    process.exit(1);
  }

  const corsOptions = {
    origin: "http://localhost:5173", // Replace with your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // Allow credentials (cookies)
  };

  // Middleware
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use((req, _, next) => {
    console.log(
      `PID: ${process.pid} METHOD: ${req.method} PATH: http://localhost:${port}${req.path}`
    );
    next();
  });
  app.use(cors(corsOptions));

  // Routes
  app.use("/api/auth", UserRouter);
  app.use("/api/product", productRouter);
  app.use("/api/category", categoryRoute);
  app.use("/api/review", reviewRoute);
  app.use("/api/cart", cartRoute);
  app.use("/api/coupon", couponRoute);
  app.use("/api/order", orderRoute);
  app.use("/api/wishlist", wishlistRoute);
  app.use("/api/address", addressRouter);

  // Error Handling Middleware
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(`Error: ${err.message}`);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  });

  // Connect to database and start server
  connectToDatabase(`${process.env.MONGO_URI}/${process.env.MONGO_DB}`)
    .then(() => {
      app.listen(port, () => {
        console.log(`Worker ${process.pid} running on port ${port}`);
      });
    })
    .catch((error: any) => {
      console.error(`Database connection error: ${error.message}`);
      process.exit(1);
    });

  // Graceful Shutdown
  process.on("SIGTERM", () => {
    console.log(`Worker ${process.pid} received SIGTERM. Exiting...`);
    process.exit();
  });

  process.on("SIGINT", () => {
    console.log(`Worker ${process.pid} received SIGINT. Exiting...`);
    process.exit();
  });
}
