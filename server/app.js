import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import dns from "node:dns";
import productRoute from "./router/product.js";
import storeRoute from "./router/store.js";
import purchaseRoute from "./router/purchase.js";
import salesRoute from "./router/sales.js";
import inviteCodeRouter from "./router/inviteCode.js";
import authRouter from "./router/auth.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);
dotenv.config();

const app = express();
const MONGODB_URI = process.env.MONGODB_URI;
let isDatabaseConnected = false;

export const connectDatabase = async () => {
  if (isDatabaseConnected) {
    return;
  }

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing. Add it to server/.env");
  }

  await mongoose.connect(MONGODB_URI);
  isDatabaseConnected = true;
  console.log("MongoDB connection successful");
};

app.disable("x-powered-by");
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use("/api/store", storeRoute);
app.use("/api/product", productRoute);
app.use("/api/purchase", purchaseRoute);
app.use("/api/sales", salesRoute);
app.use("/api/inviteCode", inviteCodeRouter);
app.use("/api", authRouter);

app.use((err, _req, res, _next) => {
  console.error("Unhandled server error:", err);
  res.status(500).json({ message: "Internal server error." });
});

export default app;
