const User = require("../models/userSchema");

// POST /api/user/register
exports.registerUser = async (req, res) => {
    try {
        const { aadhar, walletAddress, name, dob, state } = req.body;

        // Check if wallet is already linked
        const existing = await User.findOne({ walletAddress });
        if (existing)
            return res.status(400).json({ message: "Wallet already linked" });

        const newUser = new User({ aadhar, walletAddress, name, dob, state });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/user/details
exports.getUserDetails = async (req, res) => {
    try {
        const { wallet } = req.query;

        if (!wallet) {
            return res
                .status(400)
                .json({ message: "Provide either wallet address" });
        }

        const user = await User.findOne({ walletAddress: wallet });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
