import React, { useEffect, useState } from "react";
import { useBlockchain } from "../context/BlockchainContext";
import axios from "axios";

const AddCandidate = ({ isOpen, onClose, electionId, electionBlockchainId, refreshCandidates }) => {
    const { walletAddress, contract } = useBlockchain();
    const [name, setName] = useState("");
    const [party, setParty] = useState("");
    const [logo, setLogo] = useState("");
    const [candidateId, setCandidateId] = useState("");

    const [loading, setLoading] = useState(false);

    const handleAddCandidate = async (e) => {
        e.preventDefault();

        if(!contract) return alert("Contract is not Loaded");
        
        if (!candidateId || !name || !party || !logo) {
          return alert("Please fill in all fields.");
        }
      
        try {
          setLoading(true);

          console.log("contract: ", contract)
          console.log("electionBlockchainId: ", electionBlockchainId)
          console.log("candidateId: ", candidateId)
      
          // Step 1: Interact with blockchain
          const tx = await contract.addCandidate(electionBlockchainId, candidateId);
          const receipt = await tx.wait();
      
          // Extract candidateId from blockchain event
        //   const event = receipt.events?.find((e) => e.event === "CandidateAdded");
        //   const candidateId = event?.args?.candidateId;
      
        //   if (!candidateId) {
        //     throw new Error("Candidate ID not returned from blockchain.");
        //   }
      
          // Step 2: Store in DB
          await axios.post("http://localhost:8080/api/candidates/register", {
            name,
            party,
            candidateId,
            photoUrl: logo,
            electionId,
          });
      
          alert("Candidate added successfully!");

          refreshCandidates();
          setName("");
          setParty("");
          setLogo("");
          setCandidateId("");
          onClose();
        } catch (err) {
          console.error(err);
          alert("Failed to add candidate.");
        } finally {
          setLoading(false);
        }
      };
      
      useEffect(()=>{
        console.log("on addcandidate")
        console.log("contract: ", contract);
      }, [])

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                <h2 className="text-xl font-semibold mb-4">
                    Add New Candidate
                </h2>
                <form onSubmit={handleAddCandidate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">
                            CandidateId
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded"
                            value={candidateId}
                            onChange={(e) => setCandidateId(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">
                            Name
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">
                            Party
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded"
                            value={party}
                            onChange={(e) => setParty(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">
                            Logo URL
                        </label>
                        <input
                            type="url"
                            className="w-full px-3 py-2 border rounded"
                            value={logo}
                            onChange={(e) => setLogo(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCandidate;
