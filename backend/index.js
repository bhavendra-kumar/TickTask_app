const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000
app.use(cors({
  origin: ["http://localhost:5173", "https://ticktaskerapp.netlify.app/"],
  credentials: true,
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));


app.listen(port, () => console.log(`Server Connected on http://localhost:${port}`));