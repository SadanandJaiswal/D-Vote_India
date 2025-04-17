import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBlockchain } from "../context/BlockchainContext";
import { motion } from "framer-motion";

function Home() {
    const { walletAddress, connectWallet, user } = useBlockchain();
    const navigate = useNavigate();

    const handleConnect = async () => {
        await connectWallet();
    };

    useEffect(() => {
        if (walletAddress) {
            navigate("/aadhaar");
        }
        console.log("On Home")
        console.log("user: ", user);
        if(walletAddress && user){
            console.log("navigating to election category...")
            navigate("/election-category")
        }
    }, [walletAddress, navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-white px-4">
            {/* Logo + Title */}
            <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="flex items-center space-x-3 mb-4"
            >
                <img
                    src="https://img.freepik.com/free-vector/india-voting-day-background-social-campaign_1017-50504.jpg"
                    alt="D-Vote Logo"
                    className="w-12 h-12"
                />
                <h1 className="text-4xl md:text-5xl font-bold text-blue-700 text-center">
                    D-Vote India 🇮🇳
                </h1>
            </motion.div>

            {/* Tagline */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-xl text-gray-700 text-center mb-8"
            >
                Decentralized Voting Platform for a Transparent & Secure India
            </motion.p>

            {/* Description */}
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="bg-white p-6 rounded-2xl shadow-lg max-w-xl w-full"
            >
                <h2 className="text-2xl font-semibold mb-4 text-blue-600">
                    Why D-Vote?
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>
                        <strong>What:</strong> A blockchain-powered digital
                        voting system enabling secure, verifiable, and
                        transparent elections.
                    </li>
                    <li>
                        <strong>How:</strong> Uses smart contracts, wallet
                        login, and Aadhaar verification for one-person-one-vote
                        integrity.
                    </li>
                    <li>
                        <strong>Benefits over traditional EVMs:</strong>
                    </li>
                    <ul className="list-disc list-inside ml-4">
                        <li>Immutable and tamper-proof vote storage</li>
                        <li>No manual counting errors</li>
                        <li>Remote voting support</li>
                        <li>Instant results & public auditability</li>
                    </ul>
                </ul>
            </motion.div>

            {/* Wallet Section */}
            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="mt-8 flex flex-col items-center"
            >
                {walletAddress ? (
                    <>
                        <p className="text-green-700 text-lg font-medium mb-2">
                            Wallet Connected: {walletAddress.slice(0, 6)}...
                            {walletAddress.slice(-4)}
                        </p>
                        <button
                            className="bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg cursor-not-allowed"
                            disabled
                        >
                            Connected
                        </button>
                    </>
                ) : (
                    <button
                        onClick={handleConnect}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
                    >
                        Connect Wallet
                    </button>
                )}
            </motion.div>
        </div>
    );
}

export default Home;
