import app, { connectDatabase } from "../app.js";

export default async function handler(req, res) {
  try {
    await connectDatabase();
    return app(req, res);
  } catch (error) {
    console.error("Database initialization error:", error.message);
    return res.status(500).json({ message: "Database connection failed." });
  }
}
