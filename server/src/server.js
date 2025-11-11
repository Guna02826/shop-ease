import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import path from "path";

dotenv.config();
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());

// --------------------
// PUBLIC ROUTE: Health Check
// --------------------
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Shop-ease API is running 🚀",
    timestamp: new Date().toISOString(),
  });
});

// --------------------
// PROTECTED ROUTES: Apply CORS only here
// --------------------
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

app.use(
  ["/api/auth", "/api/products", "/api/orders"],
  cors({
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// --------------------
// PRODUCTION: Serve React frontend
// --------------------
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(path.resolve(), "client/build")));

  app.get("*", (req, res) => {
    if (!req.path.startsWith("/api")) {
      res.sendFile(path.join(path.resolve(), "client/build", "index.html"));
    } else {
      res.status(404).json({ message: "API route not found" });
    }
  });
} else {
  app.get("/", (req, res) => {
    res.send("Shop-ease API is running 🚀");
  });
}

// --------------------
// 404 & Error Handler
// --------------------
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

// --------------------
// Start Server
// --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
