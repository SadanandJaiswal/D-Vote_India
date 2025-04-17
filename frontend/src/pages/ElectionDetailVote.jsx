import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useBlockchain } from "../context/BlockchainContext";
import axios from "axios";
import { motion } from "framer-motion";
import { RingLoader } from "react-spinners";
import { getElectionDetailByElectoinId, voteCandidate } from "../apiFunctions";

function ElectionDetailVote() {
    const { electionId, type } = useParams();
    const { user, walletAddress, contract } = useBlockchain();
    const [election, setElection] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [hasVoted, setHasVoted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [voting, setVoting] = useState(false);
    const [electionCompleted, setElectionCompleted] = useState(false);

    useEffect(() => {
        const fetchElectionDetail = async () => {
            try {
                setLoading(true);
                const electionData = await getElectionDetailByElectoinId(
                    electionId
                );
                console.log("election: ", electionData);

                // if (electionData.length === 0) {
                //     setElection(null);
                //     setCandidates([]);
                //     return;
                // }

                setElection(electionData);
                setCandidates(electionData.candidates || []);

                if (electionData?.hasVoted?.includes(walletAddress)) {
                    setHasVoted(true);
                }

                if (electionData.status === "completed") {
                    console.log("Election is completed. Fetching winner...");
                    getWinner(electionData);
                    setElectionCompleted(true);
                    setHasVoted(true);
                }
            } catch (err) {
                console.error("Error fetching election data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchElectionDetail();
    }, [electionId, walletAddress, user]);

    useEffect(() => {
        console.log("user:", user, "wallet:", walletAddress);
    }, [user, walletAddress]);

    const handleVote = async (candidateId) => {
        if (!contract) {
            console.log("Contract is Not Loaded");
            return;
        }

        if (!walletAddress || !user) {
            alert("User should be registered to vote");
            return;
        }

        try {
            setVoting(true);

            const tx = await contract.voteElection(
                election.blockchainElectionId,
                candidateId
            );
            await tx.wait();

            await voteCandidate(electionId, walletAddress);

            alert("Vote Successful!");
            setHasVoted(true);
        } catch (err) {
            console.error("Voting failed:", err);
            alert("Voting failed. Please try again.");
        } finally {
            setVoting(false);
        }
    };

    const getWinner = async (electionData) => {
        if (!contract) {
            console.log("Contract is not Loaded");
            return;
        }
    
        if (!electionData) {
            console.log("Election data is undefined");
            return;
        }
    
        try {
            const blockchainElectionId = electionData.blockchainElectionId;
    
            const [candidatesArray, voteCountsArray] = await contract.getAllVotes(blockchainElectionId);
    
            const voteMap = {};
            candidatesArray.forEach((candidateId, index) => {
                voteMap[candidateId.toLowerCase()] = parseInt(voteCountsArray[index]);
            });
    
            const updatedCandidates = electionData.candidates.map((candidate) => ({
                ...candidate,
                votes: voteMap[candidate.candidateId.toLowerCase()] || 0,
            }));
    
            setCandidates(updatedCandidates);
            console.log("Updated candidates after fetching vote count:", updatedCandidates);
        } catch (error) {
            console.error("Error fetching winner:", error);
        }
    };
    

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <RingLoader color="#3b82f6" size={100} />
                <p className="mt-4 text-blue-600 font-semibold">
                    Loading election data...
                </p>
            </div>
        );
    }

    if (!loading && !election) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-2xl text-gray-600">
                    No {type} election available at the moment.
                </p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <motion.h1
                className="text-3xl font-bold mb-6 capitalize"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {type} Election
            </motion.h1>

            <motion.div
                className="bg-white p-6 rounded-xl shadow-lg mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <p className="text-xl font-semibold mb-2">
                    {election.name} - {election.year}
                </p>
                {type === "state" && (
                    <p className="text-gray-700">State: {election.state}</p>
                )}
                <p className="text-gray-600">
                    Start: {new Date(election.startTime).toLocaleString()}
                </p>
                <p className="text-gray-600">
                    End: {new Date(election.endTime).toLocaleString()}
                </p>
            </motion.div>

            {hasVoted ? (
                <motion.p
                    className="text-green-600 text-lg mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    You have already voted in this election.
                </motion.p>
            ) : (
                <motion.p
                    className="text-gray-700 mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    Please choose your preferred candidate.
                </motion.p>
            )}

            <button onClick={getWinner}>Get the Winner</button>

            <motion.table
                className="w-full border rounded-lg overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
            >
                <thead className="bg-gray-100">
                    <tr>
                        <th className="text-left p-3">Logo</th>
                        <th className="text-left p-3">Name</th>
                        <th className="text-left p-3">Party</th>
                        <th className="text-center p-3">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {candidates.map((candidate) => (
                        <motion.tr
                            key={candidate._id}
                            className="border-t"
                            whileHover={{
                                scale: 1.01,
                                backgroundColor: "#f9fafb",
                            }}
                        >
                            <td className="text-left p-3">
                                <img
                                    src={candidate.photoUrl}
                                    alt="logo"
                                    className="w-10 h-10 rounded-full"
                                />
                            </td>
                            <td className="text-left p-3 font-medium">
                                {candidate.name}
                            </td>
                            <td className="text-left p-3">{candidate.party}</td>
                            <td className="text-center p-3">
                                {electionCompleted ? (
                                    <span className="text-blue-600 font-semibold">
                                        Votes: {candidate.votes ?? 0}
                                    </span>
                                ) : (
                                    <button
                                        disabled={hasVoted || voting}
                                        onClick={() =>
                                            handleVote(candidate.candidateId)
                                        }
                                        className={`px-4 py-2 rounded transition font-semibold ${
                                            hasVoted
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-blue-600 hover:bg-blue-700 text-white"
                                        }`}
                                    >
                                        {voting
                                            ? "Voting..."
                                            : hasVoted
                                            ? "Voted"
                                            : "Vote"}
                                    </button>
                                )}
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </motion.table>
        </div>
    );
}

export default ElectionDetailVote;
