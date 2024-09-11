import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import color from 'colors';
import connectDB from './mongodb/connect.js';
import postRoutes from './routes/postRoutes.js';
import dalleRoutes from './routes/dalleRoutes.js';

dotenv.config();

const app = express();

const allowedOrigins = [
    'https://dalle-client-git-main-moyo-sas-projects.vercel.app',
    'https://dalle-client-qsgd8lfah-moyo-sas-projects.vercel.app',
    'https://dalle-client-qsgd8lfah-moyo-sas-projects.vercel.app/create-post'
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin, like mobile apps or curl requests
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));

app.use('/api/v1/post', postRoutes);
app.use('/api/v1/dalle', dalleRoutes);

app.get('/', async (req, res) => {
  res.send('Hello from DALL.E!')
  });

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try{
    connectDB(process.env.MONGODB_URL);
    app.listen(PORT, console.log(`Server running on port ${PORT}`.yellow.bold));
  }catch(error){
    console.log(error);
  }
 
 
};

startServer();
