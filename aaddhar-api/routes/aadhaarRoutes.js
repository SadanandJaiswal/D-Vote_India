const express = require("express");
const { registerUser } = require("../controllers/aadhaarController");

const router = express.Router();

router.post("/register", registerUser);
// router.post("/verify", verifyAadhaar);

module.exports = router;
