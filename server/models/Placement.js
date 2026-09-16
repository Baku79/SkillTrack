const mongoose = require('mongoose');

const PlacementSchema = new mongoose.Schema({
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' },
  program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },
  employer: String,
  jobTitle: String,
  sector: String,
  salary: Number,
  placedDate: Date,
  retainedAfter6Months: { type: Boolean, default: null },
  region: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Placement', PlacementSchema);
