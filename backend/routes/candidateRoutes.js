const express = require('express');
const router = express.Router();
const { registerCandidate, getCandidates, getCandidateDetails } = require('../controllers/candidateController');

router.post('/register', registerCandidate);
router.get('/election/:electionId', getCandidates);
router.get('/:candidateId', getCandidateDetails);

module.exports = router;
