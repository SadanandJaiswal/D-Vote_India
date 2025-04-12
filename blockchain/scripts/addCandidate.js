const getAadhaarVotingContract = require("./helpers/getContract");

async function main() {
    const AadhaarVotingContract = await getAadhaarVotingContract();

    const electionId = "0x6faa2edb63875d29558d8a108e903b269a7f211ab751f080d9c2b1f5bb68d7b1";
    const candidate = (await ethers.getSigners())[17].address;

    const elections = await AadhaarVotingContract.addCandidate(electionId, candidate);

    console.log("Candidate Successfully Registered to Election: ", electionId);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
