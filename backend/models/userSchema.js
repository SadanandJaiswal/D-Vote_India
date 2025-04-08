const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  aadhar: {
    type: String,
    required: true,
    unique: true, // hashed aadhar
  },
  walletAddress: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  state: {
    type: String,
    required: true,
  }
}, { timestamps: true });

// Hash aadhar before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('aadhar')) return next();
  const salt = await bcrypt.genSalt(10);
  this.aadhar = await bcrypt.hash(this.aadhar, salt);
  next();
});

// Method to compare aadhar for verification (if needed)
userSchema.methods.matchAadhar = async function (plainAadhar) {
  return await bcrypt.compare(plainAadhar, this.aadhar);
};

module.exports = mongoose.model('User', userSchema);
