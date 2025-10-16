const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth.routes');
const eventRoutes = require('./routes/event.routes');
const analyticsRoutes = require('./routes/analytics.routes');

const app = express();

connectDB();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Event Management API' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
