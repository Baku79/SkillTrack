const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  email: String,
  phone: String,
  region: String,
  sector: String,
  skills: [String],
  certifications: [{ name: String, issuer: String, year: Number }],
  trainingPrograms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Program' }],
  employmentStatus: {
    type: String,
    enum: ['placed', 'not_placed', 'self_employed', 'pursuing_education'],
    default: 'not_placed',
  },
  currentEmployer: String,
  placedDate: Date,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Candidate', CandidateSchema);
