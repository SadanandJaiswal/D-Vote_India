const mongoose = require("mongoose");

const contactInfoSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  mobile_number: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  address: {
    house_no: String,
    street: String,
    locality: String,
    pincode: String,
    district: String,
    state: String
  },
});

module.exports = mongoose.model("ContactInfo", contactInfoSchema);
