const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

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

// Connect to DB and start server
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => console.error(" DB connection error", err));
