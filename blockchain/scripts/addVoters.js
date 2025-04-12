const getAadhaarVotingContract = require("./helpers/getContract");

async function main() {
    const AadhaarVotingContract = await getAadhaarVotingContract();

    console.log("Adding Voters");

    const accounts = await ethers.getSigners();

    for(let i =1; i<=10; i++){
        const voter = accounts[i].address;
        console.log(`Voter ${i} is ${voter}`);

        await (await AadhaarVotingContract.addVoter(voter)).wait();
    }

    console.log("Voters Added Successfully");
}

main()
    .then(() => {
        process.exit(0);
    })
    .catch((error) => {
        console.log("Error: ", error);
        process.exit(1);
    });
