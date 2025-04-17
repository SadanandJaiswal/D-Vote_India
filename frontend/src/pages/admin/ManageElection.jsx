import React, { useState, useEffect } from "react";
import { useBlockchain } from "../../context/BlockchainContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import AddCandidate from "../../components/AddCandidate";
import { getElectionDetailByElectoinId } from "../../apiFunctions";

function ManageElection() {
    const { contract, walletAddress } = useBlockchain();
    const navigate = useNavigate();
    const { type, electionId } = useParams();

    const [candidates, setCandidates] = useState([]);
    const [electionDetails, setElectionDetails] = useState({});
    const [electionBlockchainId, setElectionBlockchainId] = useState(null);
    const [loading, setLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);

    const handleAddCandidateModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    useEffect(() => {
        // Uncomment to enable wallet access control
        // if (walletAddress !== adminWallet) {
        //   alert('You are not authorized to access this page.');
        //   navigate('/');
        // }
    }, [walletAddress, navigate]);

    const fetchElectionDetail = async () => {
        try {
            setLoading(true);
            const electionData = await getElectionDetailByElectoinId(
                electionId
            );
            console.log("elections: ", electionData);

            if (electionData.length === 0) {
                setElectionDetails(null);
                setCandidates([]);
                return;
            }

            setElectionDetails(electionData);
            setCandidates(electionData.candidates);
            setElectionBlockchainId(electionData.blockchainElectionId);
        } catch (err) {
            console.error("Error fetching election data:", err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchElectionDetail();
    }, [electionId]);

    const formatDateTime = (isoString) => {
        const options = { dateStyle: "medium", timeStyle: "short" };
        return new Date(isoString).toLocaleString(undefined, options);
    };
    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-4xl mx-auto p-6"
            >
                <h2 className="text-3xl font-bold mb-6 text-center">
                    Manage Election
                </h2>

                <div className="bg-white shadow-md p-6 rounded-lg space-y-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <h3 className="text-xl font-semibold">
                            {electionDetails.name}
                        </h3>
                        <span className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                            {electionDetails.status || "Status Unknown"}
                        </span>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between">
                        <p>
                            Type:{" "}
                            <span className="font-medium">
                                {electionDetails.electionType}
                            </span>
                        </p>
                        <p>
                            Year:{" "}
                            <span className="font-medium">
                                {electionDetails.year}
                            </span>
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between">
                        <p>
                            Start Time:{" "}
                            <span className="font-medium">
                                {formatDateTime(electionDetails.startTime)}
                            </span>
                        </p>
                        <p>
                            End Time:{" "}
                            <span className="font-medium">
                                {formatDateTime(electionDetails.endTime)}
                            </span>
                        </p>
                    </div>

                    <p>
                        Total Candidates:{" "}
                        <span className="font-medium">{candidates.length}</span>
                    </p>
                    {electionDetails.electionType === "state" && (
                        <p>
                            State:{" "}
                            <span className="font-medium">
                                {electionDetails.state}
                            </span>
                        </p>
                    )}
                </div>

                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold">Candidates</h3>
                        <button
                            onClick={handleAddCandidateModal}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Add New Candidate
                        </button>
                    </div>

                    <div className="overflow-x-auto rounded-lg shadow">
                        <table className="min-w-full bg-white table-auto border">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-3 border text-left">
                                        Name
                                    </th>
                                    <th className="p-3 border text-left">
                                        Party
                                    </th>
                                    <th className="p-3 border text-center">
                                        Logo
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {candidates.map((candidate) => (
                                    <tr
                                        key={candidate.candidateId}
                                        className="hover:bg-gray-50 transition"
                                    >
                                        <td className="p-3 border text-left">
                                            {candidate.name}
                                        </td>
                                        <td className="p-3 border text-left">
                                            {candidate.party}
                                        </td>
                                        <td className="p-3 border text-center">
                                            <img
                                                src={candidate.photoUrl}
                                                alt={candidate.name}
                                                className="w-10 h-10 object-contain mx-auto"
                                            />
                                        </td>
                                    </tr>
                                ))}
                                {candidates.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="text-center text-gray-500 py-4"
                                        >
                                            No candidates found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>

            <AddCandidate
                isOpen={showModal}
                onClose={handleCloseModal}
                // onSubmit={handleAddCandidate}
                electionId={electionId}
                electionBlockchainId={electionBlockchainId}
                refreshCandidates={fetchElectionDetail}
            />
        </>
    );
}

export default ManageElection;
