import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useBlockchain } from "../context/BlockchainContext";

function ElectionCategory (){
    const navigate = useNavigate();
    const { walletAddress, adminAddress } = useBlockchain();

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
            {/* 🟣 Show only if walletAddress matches adminAddress */}
            {walletAddress?.toLowerCase() === adminAddress?.toLowerCase() && (
                <div className="absolute top-6 right-6 flex gap-3">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/admin/election/create")}
                        className="bg-purple-600 text-white px-5 py-2 rounded-md shadow-lg hover:bg-purple-700 transition"
                    >
                        ➕ Create Election
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/admin/elections")}
                        className="bg-indigo-600 text-white px-5 py-2 rounded-md shadow-lg hover:bg-indigo-700 transition"
                    >
                        ⚙️ Manage Elections
                    </motion.button>
                </div>
            )}

            {/* Center Card */}
            <motion.div
                className="flex flex-col items-center gap-6 p-10 bg-white rounded-2xl shadow-lg"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <motion.h1
                    className="text-3xl font-bold mb-2 flex items-center gap-2"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    🗳️ Choose Election Type
                </motion.h1>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/election/general")}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition"
                    title="Nationwide elections to choose Members of Parliament (Lok Sabha)."
                >
                    General Election
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/election/state")}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-700 transition"
                    title="Elections to choose Members of Legislative Assembly (MLA) for your state."
                >
                    State Election
                </motion.button>
            </motion.div>
        </div>
    );
}

export default ElectionCategory;