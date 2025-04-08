const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  candidateId: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  party: {
    type: String,
    required: true,
  },
  agenda: {
    type: String,
    required: true,
  },
  photoUrl: {
    type: String,
    required: true,
  },
  electionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Election',
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Candidate', candidateSchema);
