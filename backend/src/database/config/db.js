const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.mongodb_URL).then(()=>{
}).catch((err)=>{
  if (process.env.NODE_ENV === 'development') {
    console.error('MongoDB connection error:', err);
  }
});