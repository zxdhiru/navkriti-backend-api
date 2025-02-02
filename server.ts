import cluster from "cluster";
import os from "os";
import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import connectToDatabase from "./database/db";
import cors from "cors";
import cookieParser from "cookie-parser";

// Router imports
import UserRouter from "./user/routes/user.route";
import EventRouter from "./event/routes/event.route";

dotenv.config();

const numCPUs = os.cpus().length;
const workers = new Set<number>(); // Track active workers

if (cluster.isPrimary) {
  console.log(`Primary process ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork();
    if (worker.process.pid !== undefined) {
      workers.add(worker.process.pid);
    }
  }

  cluster.on("exit", (worker, code, signal) => {
    const workerPid = worker.process.pid;
    console.error(
      `Worker ${workerPid} died with code: ${code}, signal: ${signal}`
    );

    if (workerPid !== undefined) {
      workers.delete(workerPid); // Remove from active workers
    }

    if (code !== 1) {
      console.log(`Restarting worker...`);
      const newWorker = cluster.fork();
      if (newWorker.process.pid !== undefined) {
        workers.add(newWorker.process.pid);
      }
    } else {
      console.log(`Worker exited due to DB failure. Not restarting.`);
    }

    // If all workers fail, exit the primary process
    if (workers.size === 0) {
      console.error("All workers have exited. Stopping the primary process.");
      process.exit(1);
    }
  });
} else {
  const app = express();
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;

  if (!process.env.MONGO_URI || !process.env.MONGO_DB) {
    console.error("❌ MONGO_URI or MONGO_DB environment variable is missing!");
    process.exit(1);
  }

  const corsOptions = {
    origin: ["http://localhost:5173", "https://navkriti-frontend.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  };

  // Middleware
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors(corsOptions));
  app.use((req, _, next) => {
    console.log(
      `PID: ${process.pid} METHOD: ${req.method} PATH: http://localhost:${port}${req.path}`
    );
    next();
  });

  // Routes
  app.use("/api/auth", UserRouter);
  app.use("/api/event", EventRouter);

  // Error Handling Middleware
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(`❌ Error: ${err.message}`);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  });

  // Connect to database and start server
  connectToDatabase(`${process.env.MONGO_URI}/${process.env.MONGO_DB}`)
    .then(() => {
      app.listen(port, () => {
        console.log(`✅ Worker ${process.pid} running on port ${port}`);
      });
    })
    .catch((error: any) => {
      console.error(`❌ Database connection failed: ${error.message}`);
      process.exit(1); // Ensure worker exits on DB failure
    });

  // Graceful Shutdown
  process.on("SIGTERM", () => {
    console.log(`⚠️ Worker ${process.pid} received SIGTERM. Exiting...`);
    process.exit();
  });

  process.on("SIGINT", () => {
    console.log(`⚠️ Worker ${process.pid} received SIGINT. Exiting...`);
    process.exit();
  });
}
