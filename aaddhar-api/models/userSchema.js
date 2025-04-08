const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true,
  },
  aadhar_number: {
    type: String,
    unique: true,
    required: true,
    length: 12,
  },
  is_verified: {
    type: Boolean,
    default: false,
  },
  issue_date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["active", "suspended", "deactivated"],
    default: "active",
  },
  contact_info: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ContactInfo",
  },
  biometric_data: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BiometricData",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
