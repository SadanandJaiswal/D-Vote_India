const User = require("../models/userSchema");

async function generateAadhaarNumber() {
  let aadhar;
  let exists = true;

  while (exists) {
    // Generate a 12-digit random number
    aadhar = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    
    // Ensure it's unique
    const user = await User.findOne({ aadhar_number: aadhar });
    exists = user !== null;
  }

  return aadhar;
}

module.exports = generateAadhaarNumber;
