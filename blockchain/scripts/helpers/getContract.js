// scripts/helpers/getContract.js
const { ethers, getNamedAccounts, deployments } = require("hardhat");

async function getAadhaarVotingContract() {
    const { deployer } = await getNamedAccounts();
    const signer = await ethers.getSigner(deployer);

    const contractAddress = (await deployments.get("AadhaarVoting")).address;

    const contract = await ethers.getContractAt(
        "AadhaarVoting",
        contractAddress,
        signer
    );

    return contract;
}

module.exports = getAadhaarVotingContract;
