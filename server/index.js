const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());


// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/programs', require('./routes/programs'));
app.use('/api/placements', require('./routes/placements'));
app.use('/api/candidates', require('./routes/candidates'));

// Health check
app.get('/', (req, res) => res.json({ message: '✅ SkillTrack API Running — File DB Mode (No MongoDB needed)' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 SkillTrack server running on http://localhost:${PORT}`);
  console.log(`📁 Using local file database — no MongoDB required`);
});
