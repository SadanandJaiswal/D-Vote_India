const User = require("../models/userSchema");
const ContactInfo = require("../models/contactSchema");
const BiometricData = require("../models/biometricSchema");
const generateAadhaarNumber = require("../utils/generateAadhaarNumber");

exports.registerUser = async (req, res) => {
  try {
    const { full_name, dob, gender, mobile_number, email, address, fingerprint, iris } = req.body;

    // Check if user already exists by biometric match
    const existingUser = await BiometricData.findOne({
      $or: [{ fingerprint_hash: fingerprint }, { iris_hash: iris }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Generate a unique Aadhaar number
    const aadhar_number = await generateAadhaarNumber();

    // Create new user
    const newUser = new User({ full_name, dob, gender, aadhar_number });
    await newUser.save();

    // Create contact info
    const contactInfo = new ContactInfo({ user_id: newUser._id, mobile_number, email, address });
    await contactInfo.save();

    // Save biometric data
    const biometricData = new BiometricData({
      user_id: newUser._id,
      fingerprint_hash: fingerprint,
      iris_hash: iris,
    });
    await biometricData.save();

    // Link contact and biometric data to user
    newUser.contact_info = contactInfo._id;
    newUser.biometric_data = biometricData._id;
    await newUser.save();

    res.status(201).json({ message: "User registered successfully", aadhar_number });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

