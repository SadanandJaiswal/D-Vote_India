const mongoose = require("mongoose");

const biometricSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fingerprint_hash: {
    type: String,
    required: true,
  },
  iris_hash: {
    type: String,
    required: true,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("BiometricData", biometricSchema);
