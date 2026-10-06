const express = require('express');
const cors = require('cors');
const app = express();
const orderRoutes = require('./controllers/orders');
const connectDB = require('./config/db');

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());
app.use('/api', orderRoutes);

connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err);
    process.exitCode = 1;
  });