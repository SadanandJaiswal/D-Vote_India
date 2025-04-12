const getAadhaarVotingContract = require("./helpers/getContract");

async function main() {
    const AadhaarVotingContract = await getAadhaarVotingContract();

    const electionId = "0x6faa2edb63875d29558d8a108e903b269a7f211ab751f080d9c2b1f5bb68d7b1";

    const [candidates, voteCounts] = await AadhaarVotingContract.getAllVotes(electionId);

    console.log(`\n📊 Votes for Election ID: ${electionId}`);
    candidates.forEach((candidate, idx) => {
        console.log(`Candidate: ${candidate}, Votes: ${voteCounts[idx].toString()}`);
    });
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
