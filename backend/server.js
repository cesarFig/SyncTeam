const express = require('express');
const dotenv = require('dotenv');
const actionsRoutes = require('./routes/actions');
const pautasRoutes = require('./routes/pautas');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/actions', actionsRoutes);
app.use('/api/pautas', pautasRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});