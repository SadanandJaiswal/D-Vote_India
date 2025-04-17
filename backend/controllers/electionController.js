const Election = require('../models/electionSchema');

// POST /api/elections/create
exports.createElection = async (req, res) => {
    try {
        const { name, electionType,  state, startTime, endTime, blockchainElectionId, year} = req.body;

        // Check if wallet is already linked
        const existing = await Election.findOne({ blockchainElectionId });
        if (existing)
            return res.status(400).json({ message: "Election Already There" });

        const newElection = new Election({ name, electionType,  state, startTime, endTime, blockchainElectionId, year });
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
    let filter = {
      // status: { $in: ['upcoming', 'ongoing'] }, // Only upcoming or ongoing elections
    };

    if (type) filter.electionType = type;
    if (state) filter.state = state;

    const elections = await Election.find(filter)
      .sort({ year: 1, startTime: 1, endTime: 1 });

    res.json(elections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET /api/election/:electionId
// GET /api/election/:electionId
exports.getElectionDetail = async (req, res) => {
  try {
    const { electionId } = req.params;

    const election = await Election.findOne({ _id: electionId }).populate('candidates');
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    const currentTime = new Date();

    // Determine the correct status
    let updatedStatus = election.status;
    if (currentTime < election.startTime) {
      updatedStatus = 'upcoming';
    } else if (currentTime >= election.startTime && currentTime <= election.endTime) {
      updatedStatus = 'ongoing';
    } else if (currentTime > election.endTime) {
      updatedStatus = 'completed';
    }

    election.currentTime = currentTime;

    // Update status if it's incorrect
    if (election.status !== updatedStatus) {
      election.status = updatedStatus;
      await election.save(); // save to DB
    }

    res.json(election);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.castVote = async (req, res) => {
  try {
    const { electionId, user } = req.body;

    const election = await Election.findById(electionId);
    if (!election) {
      console.log("Election hi nhi mila")
      return res.status(404).json({ message: 'Election not found' });
    }

    // Check if user has already voted
    if (election.hasVoted.includes(user)) {
      console.log("Already voted yaar")
      return res.status(400).json({ message: 'User has already voted' });
    }

    // Push user to hasVoted array
    election.hasVoted.push(user);
    await election.save();

    console.log("Vote cast successfully")
    res.json({ message: 'Vote cast successfully', election });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

