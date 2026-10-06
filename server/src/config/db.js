const mongoose = require('mongoose');
const dbURI = 'mongodb://localhost:27017/orders-app';

const connectDB = () => mongoose.connect(dbURI)
  .then(() => {
    console.log('MongoDB connected');
  });

module.exports = connectDB;