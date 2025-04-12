const getAadhaarVotingContract = require("./helpers/getContract");

async function main() {
    const AadhaarVotingContract = await getAadhaarVotingContract();

    const generalElectionids = await AadhaarVotingContract.getGeneralElectionIds();

    console.log("\n📌 General Election IDs:");
    generalElectionids.forEach((id, idx) => {
        console.log(`${idx + 1}. ${id}`);
    });

    const stateElectionids = await AadhaarVotingContract.getStateElectionIds();

    console.log("\n🏛️ State Election IDs:");
    stateElectionids.forEach((id, idx) => {
        console.log(`${idx + 1}. ${id}`);
    });
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
