const getAadhaarVotingContract = require("./helpers/getContract");

async function main() {
    const AadhaarVotingContract = await getAadhaarVotingContract();

    const ElectionType = {
        General: 0,
        State: 1,
    };

    const ELECTION_TYPE = {
        general: 0,
        state: 1,
      };

    const accounts = await ethers.getSigners();

    // const elections = [
    //     {
    //         name: "Lok Sabha Election",
    //         state: "",
    //         candidates: [
    //             accounts[11].address,
    //             accounts[12].address
    //         ],
    //         startTime: Math.floor(Date.now() / 1000) + 60,
    //         endTime: Math.floor(Date.now() / 1000) + 3600,
    //         year: 2025,
    //         type: ElectionType.General
    //     },
    //     {
    //         name: "Maharashtra Assembly Election",
    //         state: "Maharashtra",
    //         candidates: [
    //             accounts[13].address,
    //             accounts[14].address
    //         ],
    //         startTime: Math.floor(Date.now() / 1000) + 120,
    //         endTime: Math.floor(Date.now() / 1000) + 4000,
    //         year: 2025,
    //         type: ElectionType.State
    //     },
    //     {
    //         name: "Karnataka Assembly Election",
    //         state: "Karnataka",
    //         candidates: [
    //             accounts[15].address,
    //             accounts[16].address
    //         ],
    //         startTime: Math.floor(Date.now() / 1000) + 180,
    //         endTime: Math.floor(Date.now() / 1000) + 5000,
    //         year: 2025,
    //         type: ElectionType.State
    //     }
    // ];

    const elections = [
        {
            candidates: [],
            endTime: 1768555800,
            name: "Karnataka State Election ",
            startTime: 1768469400,
            state: "Karnataka",
            type: ELECTION_TYPE["state"],
            year: "2026",
        }
    ];

    for (const election of elections) {
        console.log(`Creating election: ${election.name}`);

        const tx = await AadhaarVotingContract.createElection(
            election.name,
            election.state,
            election.candidates,
            election.startTime,
            election.endTime,
            election.year,
            election.type
        );

        const receipt = await tx.wait();
        const electionId = receipt.logs[0].args[0];
        console.log(`✅ Created ${election.name} | Election ID: ${electionId}`);

        // const event = receipt.events?.find((e) => e.event === 'ElectionCreated');
        // const eid = event?.args?.electionId;

        // console.log("receipt log");
        // console.log(receipt.logs);
        // console.log("event");
        // console.log("event");
        // console.log(event);
        // console.log("eid");
        // console.log(eid);


    }

    // const election = {
    //     name: "Lok Sabha Election",
    //     state: "",
    //     candidates: [
    //         accounts[11].address,
    //         accounts[12].address
    //     ],
    //     startTime: Math.floor(Date.now() / 1000) + 60,
    //     endTime: Math.floor(Date.now() / 1000) + 3600,
    //     year: 2025,
    //     type: ElectionType.General
    // };

    // console.log(`Creating election: ${election.name}`);

    // const tx = await AadhaarVotingContract.createElection(
    //     election.name,
    //     election.state,
    //     election.candidates,
    //     election.startTime,
    //     election.endTime,
    //     election.year,
    //     election.type
    // );

    // const receipt = await tx.wait();

    // const electionId = receipt.logs[0].args[0];

    // console.log(`✅ Created ${election.name} | Election ID: ${electionId}`);
}

main()
    .then(() => {
        process.exit(0);
    })
    .catch((error) => {
        console.log("Error: ", error);
        process.exit(1);
    });
