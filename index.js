// Import necessary modules
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const todoRoutes = require('./routes/todoRoutes'); // Import routes
const app = express();


// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI,)
.then(() => console.log('MongoDB Atlas connected!'))
.catch(err => console.error('MongoDB connection error:', err)); 

// Use the routes
app.use('/api', todoRoutes);

// Sample route
app.get('/', (req, res) => {
    res.send('Welcome to the To-Do App!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


