module.exports = async ({ getNamedAccounts, deployments })=>{
    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts();

    const aadhaarVotingContract = await deploy("AadhaarVoting", {
        from: deployer,
        log: true,
        waitConfirmations: 1
    })

    console.log("Contract Deployed at address: ", aadhaarVotingContract.address);
}