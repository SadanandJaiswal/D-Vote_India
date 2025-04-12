const getAadhaarVotingContract = require("./helpers/getContract");

// Ensure voter is already registered, if not register voter -> npx hardhat run scripts/addVoters.js --network localhost
async function main() {
    const AadhaarVotingContract = await getAadhaarVotingContract();

    const electionId = "0x6faa2edb63875d29558d8a108e903b269a7f211ab751f080d9c2b1f5bb68d7b1";
    const candidates = ["0xbDA5747bFD65F08deb54cb465eB87D40e51B197E", "0x71bE63f3384f5fb98995898A86B02Fb2426c5788", "0xFABB0ac9d68B0B445fB7357272Ff202C5651694a"];

    const accounts = await ethers.getSigners();

    for(let i=1; i<=5; i++){
        const voter = accounts[i];
        const userContract = await AadhaarVotingContract.connect(voter);
        const candidate = i%3===0?candidates[0]:candidates[1];
        const tx = await userContract.voteElection(electionId, candidate);
        await tx.wait();
    
        console.log(`${voter.address} Voted ${candidate}`);
    }

    console.log("Voting Successful");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
