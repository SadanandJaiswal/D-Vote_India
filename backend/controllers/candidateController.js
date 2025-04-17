const Candidate = require('../models/candidateSchema');
const Election = require('../models/electionSchema');


// POST /api/candidates/register
exports.registerCandidate = async (req, res) => {
    try {
        const { candidateId, name, party, photoUrl, electionId } = req.body;

        console.log("1 completed")
        const election = await Election.findOne({_id: electionId});
        if(!election){
            return res.status(404).json({message: "Election Doesn't Exists"});
        }
        
        console.log("2 completed")
        // Check if Candidate is already linked
        const existing = await Candidate.findOne({ candidateId });
        if (existing)
            return res.status(400).json({ message: "Candidate already linked" });
        
        console.log("3 completed")
        const newCandidate = new Candidate({ candidateId, name, party, photoUrl, electionId });
        await newCandidate.save();
        
        console.log("4 completed")
        election.candidates.push(newCandidate._id);
        election.save();
        
        console.log("5 completed")
        res.status(201).json({ message: "Candidate registered successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/candidates/:electionId
exports.getCandidates = async (req, res) => {
  try {
    const { electionId } = req.params;
    const candidates = await Candidate.find({ electionId });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/candidates/:candidateId
exports.getCandidateDetails = async (req, res) => {
    try {
        const { candidateId } = req.params;

        if (!candidateId) {
            return res
                .status(400)
                .json({ message: "Provide candidateId" });
        }

        const candidate = await Candidate.findOne({ candidateId });
        if (!candidate) return res.status(404).json({ message: "Candidate not found" });
        res.status(201).json(candidate);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};