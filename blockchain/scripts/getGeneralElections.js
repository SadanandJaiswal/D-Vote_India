const getAadhaarVotingContract = require("./helpers/getContract");
const printElectionDetails = require("./helpers/printElectionDetails");

async function main() {
    const AadhaarVotingContract = await getAadhaarVotingContract();

    console.log("Fetching General Elections Details...");

    const elections = await AadhaarVotingContract.getGeneralElectionDetails();

    printElectionDetails(elections);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
