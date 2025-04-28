const express = require('express');
const dotenv = require('dotenv');
const actionsRoutes = require('./routes/actions');
const pautasRoutes = require('./routes/pautas');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/actions', actionsRoutes);
app.use('/api/pautas', pautasRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});