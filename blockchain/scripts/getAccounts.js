const getAadhaarVotingContract = require("./helpers/getContract");

// Ensure voter is already registered, if not register voter -> npx hardhat run scripts/addVoters.js --network localhost
async function main() {
    const accounts = await ethers.getSigners();

    for(let i=0; i<=accounts.length; i++){
        console.log(`Account ${i+1} : ${accounts[i].address}`);
    }

    console.log("Voting Successful");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
