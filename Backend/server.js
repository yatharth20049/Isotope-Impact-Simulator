const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require('cors');
const path = require("path");

// Route Imports

const chatbotRoute = require("./routes/chatbotRoute");


// Add other routes similarly

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json()); // To parse incoming JSON
app.use(cors()); // Enable CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Use dynamic origin
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
}));


// Security Middleware
const helmet = require("helmet");

app.use(helmet());  // Adding Helmet for security headers

// Static files
app.use(express.static(path.join(__dirname, 'public')));

app.use("/api", chatbotRoute);       // Routes for chatbot

// Add other routes similarly

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
