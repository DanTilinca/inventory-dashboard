const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const productRoute = require("./router/product");
const storeRoute = require("./router/store");
const purchaseRoute = require("./router/purchase");
const salesRoute = require("./router/sales");
const inviteCodeRouter = require("./router/inviteCode");
const User = require("./models/users");
const dns =require("dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

let lastAuthenticatedUser = null;

const connectDatabase = async () => {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing. Add it to server/.env");
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connection successful");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
  }
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

app.post("/api/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email, password }).lean();
    if (!user) {
      lastAuthenticatedUser = null;
      return res.status(401).json({ message: "Invalid credentials." });
    }

    lastAuthenticatedUser = user;
    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
});

// Compatibility endpoint for legacy frontend logic.
app.get("/api/login", (_req, res) => {
  res.status(200).json(lastAuthenticatedUser || null);
});

app.post("/api/register", async (req, res, next) => {
  try {
    const registerUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      phoneNumber: req.body.phoneNumber,
      imageUrl: req.body.imageUrl,
      isAdmin: req.body.isAdmin,
    });

    const savedUser = await registerUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});

app.use((err, _req, res, _next) => {
  console.error("Unhandled server error:", err);
  res.status(500).json({ message: "Internal server error." });
});

const startServer = async () => {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
