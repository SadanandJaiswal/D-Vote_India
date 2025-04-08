const mongoose = require("mongoose");

const otpVerificationSchema = new mongoose.Schema({
  aadhar_number: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("OtpVerification", otpVerificationSchema);
