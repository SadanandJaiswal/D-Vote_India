const printElectionDetails = (elections) => {
    if (!elections || elections.length === 0) {
        console.log("No Election to Show");
        return;
    }

    elections.forEach((election, index) => {
        console.log(`\nElection #${index + 1}`);
        console.log(`Name       : ${election.name}`);
        console.log(`ElectionId : ${election.electionId}`);
        console.log(`State      : ${election.state}`);
        console.log(`Start Time : ${new Date(Number(election.startTime) * 1000).toLocaleString()}`);
        console.log(`End Time   : ${new Date(Number(election.endTime) * 1000).toLocaleString()}`);
        console.log(`Year       : ${election.year}`);
        console.log(`Is Active  : ${election.isActive}`);
        console.log(`Candidates : ${election.candidates.join(", ")}`);
    });

    console.log("\n✅ Fetched Elections Successfully");
};

module.exports = printElectionDetails;
