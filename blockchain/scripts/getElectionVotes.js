const getAadhaarVotingContract = require("./helpers/getContract");

async function main() {
    const AadhaarVotingContract = await getAadhaarVotingContract();

    const electionId = "0xa1a30849790226944ef15d81cb5ffb84e78cc5d82e686436b7863ec38faee088";

    const [candidatesArray, voteCountsArray] = await AadhaarVotingContract.getAllVotes(electionId);

    console.log(`\n📊 Votes for Election ID: ${electionId}`);
    candidatesArray.forEach((candidate, idx) => {
        console.log(`Candidate: ${candidate}, Votes: ${voteCountsArray[idx].toString()}`);
    });
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
