const express = require('express');
const router = express.Router();
const { createElection, getElections, getElectionDetail, castVote } = require('../controllers/electionController');

router.post('/create', createElection);
router.get('/', getElections);
router.get('/:electionId', getElectionDetail);
router.put('/vote', castVote);

module.exports = router;
