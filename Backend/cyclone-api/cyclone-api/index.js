const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { authMiddleware } = require('./middleware/auth');
const cycloneRoutes = require('./routes/cyclone');
const cyclonesRoutes = require('./routes/cyclones');
const helplineRoutes = require('./routes/helplines');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(authMiddleware);

app.use('/cyclone', cycloneRoutes);
app.use('/cyclones', cyclonesRoutes);
app.use('/helplines', helplineRoutes);

app.get('/', (req, res) => res.send('Cyclone API running'));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});