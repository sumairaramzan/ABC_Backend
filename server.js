const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// ✅ Allow specific origins (your Vercel frontend + localhost)
const allowedOrigins = [
  'http://localhost:3000',
  'https://abc-project-main-git-main-sumairaramzans-projects.vercel.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('CORS not allowed from this origin: ' + origin));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.get('/', (req, res) => res.send('API Running...'));
app.use('/api/stripe', require('./routes/stripeRoutes'));
app.use('/api/user', require('./routes/userRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
