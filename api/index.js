import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import expense from "./routes/expense.route.js";
import project from "./routes/project.route.js";
import taskRoutes from "./routes/taskRoutes.js";
import supplier from "./routes/supplierRouter.js";
import PaymentRoutes from "./routes/payment.route.js";
import cors from "cors";

import cookieParser from "cookie-parser";
import path from "path";
import Supplier from "./models/supplier.model.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("MongoDb is connected");
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();

const app = express();
app.use(cors());

app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/expense", expense);
app.use("/api/project", project);
app.use("/api/task", taskRoutes);
app.use("/api/supplier", supplier);
app.use("/api/payment", PaymentRoutes);

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
