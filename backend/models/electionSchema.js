const mongoose = require('mongoose');

const electionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  electionType: {
    type: String,
    enum: ['general', 'state', 'local'],
    required: true,
  },
  state: {
    type: String,
    required: function () {
      return this.electionType !== 'general';
    }
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  blockchainElectionId: {
    type: String,
    required: true,
  },
  year:{
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming'
  },
  candidates: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate'
    }
  ],
  hasVoted: [
    {
      type: String
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Election', electionSchema);
