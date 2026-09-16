const mongoose = require('mongoose');

const ProgramSchema = new mongoose.Schema({
  name: { type: String, required: true },
  institute: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  instituteName: String,
  sector: String,
  duration: String, // e.g., "3 months"
  skillsTaught: [String],
  totalEnrolled: { type: Number, default: 0 },
  totalCompleted: { type: Number, default: 0 },
  totalPlaced: { type: Number, default: 0 },
  cost: Number, // per candidate in INR
  region: String,
  startDate: Date,
  endDate: Date,
  status: { type: String, enum: ['active', 'completed', 'upcoming'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Program', ProgramSchema);
