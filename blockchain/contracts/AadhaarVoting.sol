// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AadhaarVoting {
    address public admin;

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this");
        _;
    }

    enum ElectionType { General, State }

    struct Election {
        string name;
        string state; // Empty for general election
        uint256 startTime;
        uint256 endTime;
        uint256 year;
        bool isActive;
        address[] candidates;
        mapping(address => uint256) votes;
        mapping(address => bool) hasVoted;
        mapping(address => bool) isValidCandidate;
    }

    // A helper struct without mappings for safe return
    struct ElectionDetails {
        bytes32 electionId;
        string name;
        string state;
        uint256 startTime;
        uint256 endTime;
        uint256 year;
        bool isActive;
        address[] candidates;
    }


    mapping(address => bool) public voters;
    mapping(bytes32 => Election) public elections;

    bytes32[] public generalElectionIds;
    bytes32[] public stateElectionIds;

    event ElectionCreated(bytes32 indexed electionId);

    // === Voter Management ===
    function addVoter(address _voter) public {
        voters[_voter] = true;
    }
    // function addVoter(address _voter) public onlyAdmin {
    //     voters[_voter] = true;
    // }

    function isEligible(address _voter) public view returns (bool) {
        return voters[_voter];
    }

    // === Candidate Management ===
    function addCandidate(bytes32 _electionId, address _candidate) public onlyAdmin {
        Election storage election = elections[_electionId];
        
        require(election.isActive, "Election not active");
        require(!election.isValidCandidate[_candidate], "Candidate already added");

        election.candidates.push(_candidate);
        // election.votes[_candidate] = 0;
        election.isValidCandidate[_candidate] = true;
    }


    // === Election ID Generator ===
    function getElectionId(
        string memory _name,
        ElectionType _type,
        string memory _state,
        uint256 _year
    ) internal view returns (bytes32) {
        return keccak256(abi.encodePacked(_name, _type, _state, _year, block.timestamp));
    }

    // === Create Election ===
    function createElection(
        string memory _name,
        string memory _state, // Pass "" for general election
        address[] memory _candidates,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _year,
        ElectionType _type
    ) public onlyAdmin returns (bytes32) {
        require(_startTime < _endTime, "Invalid election time");

        bytes32 electionId = getElectionId(_name, _type, _state, _year);

        Election storage election = elections[electionId];
        election.name = _name;
        election.state = _state;
        election.startTime = _startTime;
        election.endTime = _endTime;
        election.year = _year;
        election.isActive = true;
        
        for (uint i = 0; i < _candidates.length; i++) {
            address candidate = _candidates[i];
            election.candidates.push(candidate);
            election.isValidCandidate[candidate] = true;
        }


        if (_type == ElectionType.General) {
            generalElectionIds.push(electionId);
        } else {
            stateElectionIds.push(electionId);
        }

        emit ElectionCreated(electionId);

        return electionId;
    }

    // === Vote ===
    function voteElection(bytes32 _electionId, address _candidate) public {
        require(voters[msg.sender], "Not eligible");

        Election storage election = elections[_electionId];
        require(election.isActive, "Election not active");
        require(block.timestamp >= election.startTime && block.timestamp <= election.endTime, "Election not running");

        // Cache storage reference
        mapping(address => bool) storage hasVoted = election.hasVoted;
        mapping(address => bool) storage isValidCandidate = election.isValidCandidate;

        require(!hasVoted[msg.sender], "Already voted");
        require(isValidCandidate[_candidate], "Invalid candidate");

        hasVoted[msg.sender] = true;
        election.votes[_candidate]++;

    }

    // Votes of Candidate in particular Election
    function getAllVotes(bytes32 _electionId) public view returns (address[] memory, uint256[] memory) {
        Election storage election = elections[_electionId];
        uint256 candidatesCount = election.candidates.length;
        
        address[] memory candidateList = new address[](candidatesCount);
        uint256[] memory voteCounts = new uint256[](candidatesCount);
        
        for (uint256 i = 0; i < candidatesCount; i++) {
            candidateList[i] = election.candidates[i];
            voteCounts[i] = election.votes[election.candidates[i]];
        }
        
        return (candidateList, voteCounts);
    }


    // === Election Winner ===
    function getElectionWinner(bytes32 _electionId) public view returns (address winner, uint256 highestVotes) {
        Election storage election = elections[_electionId];
        require(election.candidates.length > 0, "No candidates found");

        uint256 maxVotes = 0;
        address topCandidate;

        for (uint256 i = 0; i < election.candidates.length; i++) {
            address candidate = election.candidates[i];
            uint256 votes = election.votes[candidate];

            if (votes > maxVotes) {
                maxVotes = votes;
                topCandidate = candidate;
            }
        }

        return (topCandidate, maxVotes);
    }

    // Election Winner (if tie is there)
    function getElectionWinners(bytes32 _electionId) public view returns (address[] memory, uint256) {
        Election storage election = elections[_electionId];
        uint256 candidatesLength = election.candidates.length;

        require(candidatesLength > 0, "No candidates found");

        address[] memory tempWinners = new address[](candidatesLength);
        uint256 maxVotes = 0;
        uint256 winnerCount = 0;

        for (uint256 i = 0; i < candidatesLength; i++) {
            address candidate = election.candidates[i];
            uint256 votes = election.votes[candidate];

            if (votes > maxVotes) {
                maxVotes = votes;
                winnerCount = 1;
                tempWinners[0] = candidate;
            } else if (votes == maxVotes) {
                tempWinners[winnerCount] = candidate;
                winnerCount++;
            }
        }

        address[] memory winners = new address[](winnerCount);
        for (uint256 i = 0; i < winnerCount; i++) {
            winners[i] = tempWinners[i];
        }

        return (winners, maxVotes);
    }

    // Get Election Details
    function _getElectionDetails(bytes32[] storage electionIds) internal view returns (ElectionDetails[] memory) {
        uint256 count = electionIds.length;
        ElectionDetails[] memory details = new ElectionDetails[](count);

        for (uint256 i = 0; i < count; i++) {
            bytes32 electionId = electionIds[i];
            Election storage e = elections[electionId];

            details[i] = ElectionDetails({
                electionId: electionId,
                name: e.name,
                state: e.state,
                startTime: e.startTime,
                endTime: e.endTime,
                year: e.year,
                isActive: e.isActive,
                candidates: e.candidates
            });
        }

        return details;
    }

    function getGeneralElectionDetails() public view returns (ElectionDetails[] memory) {
        return _getElectionDetails(generalElectionIds);
    }

    function getStateElectionDetails() public view returns (ElectionDetails[] memory) {
        return _getElectionDetails(stateElectionIds);
    }




    // === Getters ===
    function getCandidateVotes(bytes32 _electionId, address _candidate) public view returns (uint256) {
        return elections[_electionId].votes[_candidate];
    }

    function userHasVoted(bytes32 _electionId, address _voter) public view returns (bool) {
        return elections[_electionId].hasVoted[_voter];
    }

    function getElectionCandidates(bytes32 _electionId) public view returns (address[] memory) {
        return elections[_electionId].candidates;
    }

    function getGeneralElectionIds() public view returns (bytes32[] memory) {
        return generalElectionIds;
    }

    function getStateElectionIds() public view returns (bytes32[] memory) {
        return stateElectionIds;
    }
}
