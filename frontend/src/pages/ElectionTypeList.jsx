import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { RingLoader } from "react-spinners";
import { useBlockchain } from "../context/BlockchainContext";
import { fetchElections } from "../apiFunctions";

function ElectionTypeList() {
    const { type } = useParams();
    const { user, walletAddress } = useBlockchain();

    const [elections, setElections] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const getElectionDetails = async () => {
            try {
                setLoading(true);
                const elections = await fetchElections({ type });

                // if(elections.length === 0){
                //     setElections(null);
                //     return;
                // }

                console.log("elections: ", elections);

                setElections(elections);
            } catch (err) {
                console.error("Error fetching election data:", err);
            } finally {
                setLoading(false);
            }
        };

        getElectionDetails();

        // if( walletAddress && user){
        //     getElectionDetails();
        // }else{
        //     setLoading(false);
        // }
    }, [type]);

    useEffect(() => {
        console.log("ElectionDetail - user:", user, "wallet:", walletAddress);
    }, [user, walletAddress]);

    const getStatus = (start, end) => {
        const now = new Date();
        const startTime = new Date(start);
        const endTime = new Date(end);
        if (now < startTime) return "Upcoming";
        if (now > endTime) return "Past";
        return "Ongoing";
    };

    const handleElectionClick = (type, electionId) => {
        console.log("ElectionID: ", electionId);
        console.log("Type: ", type);
        navigate(`/election/${type}/${electionId}/vote`);
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <h2 className="text-4xl font-bold text-center mb-10">
                🗳️ All {type} Elections
            </h2>
    
            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <RingLoader color="#4A90E2" />
                </div>
            ) : elections.length === 0 ? (
                <div className="text-center text-gray-600 text-lg mt-12">
                    🚫 No {type} elections available at the moment.
                </div>
            ) : (
                <div className="space-y-6">
                    {elections.map((election, index) => {
                        const status = getStatus(
                            election.startTime,
                            election.endTime
                        );
                        const key = election._id || index;
    
                        return (
                            <motion.div
                                key={key}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 bg-white p-6"
                                onClick={() =>
                                    handleElectionClick(
                                        election.electionType,
                                        election._id
                                    )
                                }
                            >
                                <div className="flex flex-col sm:flex-row sm:justify-between mb-2">
                                    <h3 className="text-2xl font-semibold">
                                        {election.name}
                                    </h3>
                                    <span
                                        className={`mt-2 sm:mt-0 text-sm font-semibold px-3 py-1 rounded-full w-fit ${
                                            status === "Upcoming"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : status === "Ongoing"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {status}
                                    </span>
                                </div>
    
                                <div className="flex flex-col sm:flex-row sm:justify-between text-gray-700 text-sm mb-1">
                                    <p>
                                        <span className="font-medium">
                                            Election Type:
                                        </span>{" "}
                                        {election.electionType}
                                    </p>
                                    <p className="mt-1 sm:mt-0">
                                        <span className="font-medium">Year:</span>{" "}
                                        {election.year}
                                    </p>
                                </div>
    
                                <div className="flex flex-col sm:flex-row sm:justify-between text-gray-700 text-sm mb-1">
                                    <p>
                                        <span className="font-medium">
                                            Start Time:
                                        </span>{" "}
                                        {new Date(
                                            election.startTime
                                        ).toLocaleString()}
                                    </p>
                                    <p className="mt-1 sm:mt-0">
                                        <span className="font-medium">
                                            End Time:
                                        </span>{" "}
                                        {new Date(
                                            election.endTime
                                        ).toLocaleString()}
                                    </p>
                                </div>
    
                                {/* Conditional Section */}
                                {type === "state" ? (
                                    <div className="flex flex-col sm:flex-row sm:justify-between text-gray-700 text-sm mb-4">
                                        <p>
                                            <span className="font-medium">
                                                State:
                                            </span>{" "}
                                            {election.state || "N/A"}
                                        </p>
                                        <p className="mt-1 sm:mt-0">
                                            <span className="font-medium">
                                                Total Candidates:
                                            </span>{" "}
                                            {election.candidates?.length || 0}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="text-gray-700 text-sm mb-4">
                                        <span className="font-medium">
                                            Total Candidates:
                                        </span>{" "}
                                        {election.candidates?.length || 0}
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
    
}

export default ElectionTypeList;
