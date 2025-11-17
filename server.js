const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// API Routes
const mpesaRouter = require('./api/mpesa');
app.use('/api/mpesa', mpesaRouter);

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/shop', (req, res) => {
    res.sendFile(path.join(__dirname, 'shop.html'));
});

app.get('/why', (req, res) => {
    res.sendFile(path.join(__dirname, 'Why', 'why.html'));
});

app.get('/instructions', (req, res) => {
    res.sendFile(path.join(__dirname, 'instructions', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`DELAMA E-Commerce Server running on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);
});
