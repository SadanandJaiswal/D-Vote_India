import React, { useState, useEffect } from "react";
import { useBlockchain } from "../../context/BlockchainContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

function CreateElection() {
    const { walletAddress, contract, adminAddress } = useBlockchain();
    const navigate = useNavigate();

    const [type, setType] = useState("general");
    const [name, setName] = useState("");
    const [stateName, setStateName] = useState("");
    const [year, setYear] = useState(new Date().getFullYear());
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log("Connected Wallet : ", walletAddress);
        console.log("Admin Wallet : ", adminAddress);
        console.log("Contract: ", contract);
        // if (walletAddress !== adminAddress) {
        //   alert('You are not authorized to access this page.');
        //   navigate('/');
        // }
    }, [walletAddress]);

    const toTimestamp = (datetimeStr) =>
        Math.floor(new Date(datetimeStr).getTime() / 1000);

    const ELECTION_TYPE = {
        general: 0,
        state: 1,
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!contract) return alert("Contract not loaded");

        console.log("Contract: ", contract);

        if (new Date(startTime) >= new Date(endTime)) {
            return alert("End time must be after start time");
        }

        setLoading(true);

        console.log("Transaction Details");
        console.log({
            name: name,
            state: type === "state" ? stateName : "",
            candidates: [],
            startTime: toTimestamp(startTime),
            endTime: toTimestamp(endTime),
            year,
            type: ELECTION_TYPE[type],
        });

        try {
            const tx = await contract.createElection(
                name,
                type === "state" ? stateName : "",
                [],
                toTimestamp(startTime),
                toTimestamp(endTime),
                year,
                ELECTION_TYPE[type]
            );
            const receipt = await tx.wait();

            console.log("Receipt Logs: ", receipt.logs);
            const electionId = receipt.logs[0].args[0];

            console.log("Election id: ", electionId);

            // Store to DB
            await axios.post("http://localhost:8080/api/elections/create", {
                blockchainElectionId: electionId,
                name,
                electionType: type,
                state: type === "state" ? stateName : null,
                year,
                startTime,
                endTime,
            });

            alert("Election created successfully!");
            navigate(`/admin/elections`);
        } catch (err) {
            console.error(err);
            alert("Election creation failed.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <motion.div
            className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
                Create New Election
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium">Election Type</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full border p-2 rounded mt-1"
                    >
                        <option value="general">General</option>
                        <option value="state">State</option>
                    </select>
                </div>

                <div>
                    <label className="block font-medium">Election Name</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border p-2 rounded mt-1"
                        placeholder="e.g., 2025 General Election"
                    />
                </div>

                {type === "state" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <label className="block font-medium">State Name</label>
                        <input
                            type="text"
                            required
                            value={stateName}
                            onChange={(e) => setStateName(e.target.value)}
                            className="w-full border p-2 rounded mt-1"
                            placeholder="e.g., Maharashtra"
                        />
                    </motion.div>
                )}

                <div>
                    <label className="block font-medium">Year</label>
                    <input
                        type="number"
                        required
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full border p-2 rounded mt-1"
                        min="2024"
                        max="2100"
                    />
                </div>

                <div>
                    <label className="block font-medium">Start Time</label>
                    <input
                        type="datetime-local"
                        required
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full border p-2 rounded mt-1"
                    />
                </div>

                <div>
                    <label className="block font-medium">End Time</label>
                    <input
                        type="datetime-local"
                        required
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full border p-2 rounded mt-1"
                    />
                </div>

                {/* <div>
              <label className="block font-medium">Description</label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border p-2 rounded mt-1"
                rows={3}
                placeholder="Brief description of the election..."
              />
            </div> */}

                <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded ${
                        loading && "opacity-60 cursor-not-allowed"
                    }`}
                >
                    {loading ? "Creating..." : "Create Election"}
                </motion.button>
            </form>
        </motion.div>
    );
}

export default CreateElection;
