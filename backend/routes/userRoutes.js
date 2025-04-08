const express = require('express');
const router = express.Router();
const { registerUser, getUserDetails } = require('../controllers/userController');
const verifyAadhar = require("../middleware/verifyAadhar");

router.post('/register', verifyAadhar, registerUser);
router.get('/details', getUserDetails);

module.exports = router;
