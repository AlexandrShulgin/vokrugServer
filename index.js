const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./src/config/db');
const { errorHandler } = require('./src/middleware/errorMiddleware');
const userRoutes = require('./src/routes/userRouter')
const eventRoutes = require('./src/routes/eventRouter')

// Load config
dotenv.config({ path: './.env' });

// Connect to MongoDB
connectDB();

const app = express();

// Bodyparser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Routes
app.use('/api', userRoutes);
app.use('/api', eventRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));