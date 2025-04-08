const Election = require('../models/electionSchema');

// POST /api/elections/create
exports.createElection = async (req, res) => {
    try {
        const { name, electionType,  state, startTime, endTime, blockchainElectionId} = req.body;

        // Check if wallet is already linked
        const existing = await Election.findOne({ blockchainElectionId });
        if (existing)
            return res.status(400).json({ message: "Election Already There" });

        const newElection = new Election({ name, electionType,  state, startTime, endTime, blockchainElectionId });
        await newElection.save();

        res.status(201).json({ message: "Election Created successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/elections?type=general OR /state?state=MP
exports.getElections = async (req, res) => {
  try {
    const { type, state } = req.query;
    let filter = {};

    if (type) filter.electionType = type;
    if (state) filter.state = state;

    const elections = await Election.find(filter);
    res.json(elections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
