const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.mongodb_URL).then(()=>{
    console.log('Connected to MongoDB');
}).catch((err)=>{
    console.error('MongoDB connection error:', err);
});