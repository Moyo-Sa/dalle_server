import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import color from 'colors';
import connectDB from './mongodb/connect.js';
import postRoutes from './routes/postRoutes.js';
import dalleRoutes from './routes/dalleRoutes.js';
import mongoose from "mongoose";

dotenv.config();

const app = express();

// --- CORS Configuration ---
const allowedOrigins = [
  'https://dalle-client-3agbz4voi-moyo-sas-projects.vercel.app',
  'https://dalle-client-git-main-moyo-sas-projects.vercel.app',
  'https://dalle-client-moyo-sas-projects.vercel.app', 
  'https://dalle-client-six.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`CORS blocked for origin: ${origin}`);
      // Respond gracefully instead of throwing
      return callback(null, false);
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests globally

// --- Middleware ---
app.use(express.json({ limit: '50mb' }));

// --- Routes ---
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/dalle', dalleRoutes);

app.get('/', async (req, res) => {
  res.send('Hello from DALL.E!');
});

// --- Server Setup ---
const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`.yellow.bold)
    );
  } catch (error) {
    console.log(error);
  }
};

startServer();


// Keep MongoDB Atlas free tier awake - ping every 4 minutes
setInterval(async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.db.admin().ping();
      console.log("MongoDB keepalive ping - " + new Date().toISOString());
    }
  } catch (err) {
    console.error("Keepalive ping failed:", err.message);
  }
}, 4 * 60 * 1000);