import express from "express";
import mongoose from "mongoose";
import cors from "cors"; // ✅ Add this
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Paste this CORS block after app initialization
const allowedOrigins = [
  'https://ticktaskerapp.netlify.app',
  'https://main--ticktaskerapp.netlify.app',
  'https://deploy-preview-2--ticktaskerapp.netlify.app',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS policy blocked: ' + origin), false);
    }
  },
  credentials: true
}));

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("DB connection error", err));


app.listen(port, () => console.log(`Server Connected on http://localhost:${port}`));